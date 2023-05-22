use crate::proto::command::{
    self, mail_account_client::MailAccountClient, message_service_client::MessageServiceClient,
};
use anyhow::Result;
use log::debug;
use prost::bytes::Buf;
use prost::Message;
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{UnixListener, UnixStream};
use tokio::sync::broadcast::*;
use tokio::sync::Notify;
use tokio::task::JoinHandle;
use tonic::transport::{Channel, Endpoint, Uri};
use tonic::Request;
use tower::service_fn;
#[derive(Default, Debug, serde::Serialize, serde::Deserialize)]
pub struct ClientRequest {
    pub command_id: i32,
    pub payload: Vec<u8>,
}

impl ClientRequest {
    pub fn new(command_id: i32, payload: Vec<u8>) -> Self {
        Self {
            command_id,
            payload,
        }
    }

    pub fn from_json(json: &str) -> Self {
        serde_json::from_str(json).unwrap_or_default()
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap_or_default()
    }
}

pub fn invoke_sync(address: String, request: ClientRequest) -> Result<Vec<u8>> {
    tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(invoke(address, request))
}

pub struct ClientApp {
    pub payload: Vec<u8>,
    pub channel: Channel,
}
/// Connect to server
/// 只会进行一次通信，结束后断开连接
/// 不持有长连接
pub async fn invoke(address: String, request: ClientRequest) -> Result<Vec<u8>> {
    let channel = Endpoint::try_from("http://[::]:50051")?
        .connect_with_connector(service_fn(move |_: Uri| {
            // let path = Path::new(&address);
            debug!("connect to path:{}", address);
            // Connect to a Uds socket
            UnixStream::connect(address.clone())
        }))
        .await?;

    let app = ClientApp {
        payload: request.payload,
        channel,
    };

    match request.command_id {
        10001 => get_mail_labels(app).await,
        10002 => get_mail_list(app).await,
        10003 => get_mail_message(app).await,
        10004 => send_mail(app).await,
        20001 => update_mail_account(app).await,
        20002 => get_mail_account(app).await,
        _ => error_invoke(),
    }
}

pub async fn get_mail_labels(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::GetMailLabelsRequest::decode(&*app.payload)?);
    let mut client = MessageServiceClient::new(app.channel);
    let response = client.get_mail_labels(request).await?.get_ref().to_owned();
    debug!("[get mail label]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub async fn get_mail_list(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::GetMailListRequest::decode(&*app.payload)?);
    let mut client = MessageServiceClient::new(app.channel);
    let response = client.get_mail_list(request).await?.get_ref().to_owned();
    debug!("[get mail list]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub async fn get_mail_message(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::GetMailMessageRequest::decode(&*app.payload)?);
    let mut client = MessageServiceClient::new(app.channel);
    let response = client.get_mail_message(request).await?.get_ref().to_owned();
    debug!("[get mail message]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub async fn send_mail(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::SendMailRequest::decode(&*app.payload)?);
    let mut client = MessageServiceClient::new(app.channel);
    let response = client.send_mail(request).await?.get_ref().to_owned();
    debug!("[get mail message]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub async fn update_mail_account(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::UpdateAccountRequest::decode(&*app.payload)?);
    let mut client = MailAccountClient::new(app.channel);
    let response = client.update_account(request).await?.get_ref().to_owned();
    debug!("[get mail message]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub async fn get_mail_account(app: ClientApp) -> Result<Vec<u8>> {
    let request = Request::new(command::GetAccountRequest::decode(&*app.payload)?);
    let mut client = MailAccountClient::new(app.channel);
    let response = client.get_account(request).await?.get_ref().to_owned();
    debug!("[get mail message]client:resp::{:?}", response);
    Ok(response.encode_to_vec())
}

pub fn error_invoke() -> Result<Vec<u8>> {
    let error_msg = "error invoke command ,please retry your command";
    Ok(error_msg.as_bytes().to_vec())
}
// pub async fn invoke(address: Arc<PathBuf>, request: ClientRequest) -> Vec<String> {
//     let mut outputs = vec![];
//     let mut stream = UnixStream::connect(&*address).await.unwrap();
//     stream.write_all("echo".as_bytes()).await.unwrap();
//     let mut breader = BufReader::new(stream);
//     let mut buf = vec![];
//     if let Ok(len) = breader.read_buf(&mut buf).await {
//         if len != 0 {
//             let value = String::from_utf8(buf.clone()).unwrap();
//             debug!("connect [{:?}] {value}",request);
//             outputs.push(value);
//         };

//         buf.clear();
//     }

//     debug!("connect [{:?}] ENDED",request);
//     outputs
// }
