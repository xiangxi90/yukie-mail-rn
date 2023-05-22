use std::path::Path;
use tokio::net::UnixListener;
use tokio_stream::wrappers::UnixListenerStream;
use tonic::transport::server::UdsConnectInfo;
use tonic::{transport::Server, Request, Response, Status};

use crate::proto::{
    command::{
        self, mail_account_server::MailAccount, mail_account_server::MailAccountServer,
        message_service_server::MessageService, message_service_server::MessageServiceServer,
    },
    mail_base,
};
// use anyhow::Result;
use log::debug;

pub mod server_log;
pub mod service;

#[derive(Default)]
pub struct MailMessageService {}

#[tonic::async_trait]
impl MessageService for MailMessageService {
    async fn get_mail_labels(
        &self,
        request: Request<command::GetMailLabelsRequest>,
    ) -> std::result::Result<Response<command::GetMailLabelResponse>, Status> {
        let conn_info = request.extensions().get::<UdsConnectInfo>().unwrap();
        debug!("Got a request {:?} with info {:?}", request, conn_info);
        let labels =
            service::labels::get_mail_labels(request.into_inner().labels).unwrap_or_default();
        let mut response = command::GetMailLabelResponse::default();
        response.labels = labels;
        Ok(Response::new(response))
    }

    async fn get_mail_list(
        &self,
        request: Request<command::GetMailListRequest>,
    ) -> std::result::Result<Response<command::GetMailListResponse>, Status> {
        debug!("[get mail list]req:{:?}", request);
        let response = service::message::get_mail_list(request.into_inner())
            .await
            .unwrap_or_default();
        Ok(Response::new(response))
    }

    async fn get_mail_message(
        &self,
        request: Request<command::GetMailMessageRequest>,
    ) -> std::result::Result<Response<command::GetMailMessageResponse>, Status> {
        debug!("[get mail message]req:{:?}", request);
        let response = service::message::get_mail_message(request.into_inner())
            .await
            .unwrap_or_default();
        Ok(Response::new(response))
    }

    async fn send_mail(
        &self,
        request: Request<command::SendMailRequest>,
    ) -> std::result::Result<Response<command::SendMailRespone>, Status> {
        let mut response = command::SendMailRespone::default();
        Ok(Response::new(response))
    }
}

#[derive(Default)]
pub struct MailAccountService {}

#[tonic::async_trait]
impl MailAccount for MailAccountService {
    async fn update_account(
        &self,
        request: Request<command::UpdateAccountRequest>,
    ) -> std::result::Result<Response<command::UpdateAccountResponse>, Status> {
        debug!("server [mail update account]req:{:?}", request);
        service::account::mail_update_mail_account(request.into_inner());
        let response = command::UpdateAccountResponse::default();
        Ok(Response::new(response))
    }

    async fn get_account(
        &self,
        request: Request<command::GetAccountRequest>,
    ) -> std::result::Result<Response<command::GetAccountResponse>, Status> {
        debug!("server [mail get account]");
        let account = service::account::mail_get_account().unwrap_or_default();
        let mut response = command::GetAccountResponse::default();
        response.account = Some(account);
        Ok(Response::new(response))
    }
}

/// 初始化创建服务进程，启动uds服务
/// 根据传入thread nums来确认服务最大线程数
pub fn start_server(
    thread_nums: usize,
    socket_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    tokio::runtime::Builder::new_multi_thread()
        .worker_threads(thread_nums)
        .enable_all()
        .build()
        .unwrap()
        .block_on(start(socket_path))
}

pub async fn start(socket_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    server_log::init_log_server();
    // 开始前先保证文件不存在，避免绑定错误
    tokio::fs::remove_file(socket_path).await.ok();

    let listener = UnixListener::bind(socket_path)?;
    let message_service = MailMessageService::default();
    let account_service = MailAccountService::default();
    let uds_stream = UnixListenerStream::new(listener);

    Server::builder()
        .add_service(MessageServiceServer::new(message_service))
        .add_service(MailAccountServer::new(account_service))
        .serve_with_incoming(uds_stream)
        .await?;

    Ok(())
}
