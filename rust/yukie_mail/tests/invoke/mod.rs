use log::*;
use log4rs;
use prost::Message;
use yukie_mail::client::{invoke, ClientRequest};
use yukie_mail::proto::{command, mail_base};
use yukie_mail::tonic_server::start;
#[tokio::test]
async fn test_server() {
    init_log_server();

    tokio::spawn(async {
        debug!("start server");
        start("/tmp/mytest.socket").await.unwrap();
    });

    debug!("start client");
    let mut request = command::GetMailLabelsRequest::default();
    request.labels = vec!["INBOX".to_string()];

    let req = ClientRequest {
        command_id: 10001,
        payload: request.encode_to_vec(),
    };

    tokio::time::sleep(tokio::time::Duration::from_secs(10));
    let response = invoke("/tmp/mytest.socket".to_string(), req).await.unwrap();
    let resp = command::GetMailLabelResponse::decode(&*response).unwrap();
    println!("{:?}", resp);
}

pub fn init_log_server() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init rust server log");
}

#[tokio::test]
pub async fn test_update_account() {
    init_log_server();
    let mut req = command::UpdateAccountRequest::default();
    req.account = Some(mail_base::Account {
        mail_address: Some(mail_base::MailAddress {
            name: "Kuze".to_string(),
            address: "kuzehibiki@126.com".to_string(),
        }),
        status: 0,
        smtp_server: "smtp.126.com".to_string(),
        smtp_account: "kuzehibiki@126.com".to_string(),
        smtp_port: 25,
        smtp_password: "IFHXQOCVBMPLJQTD".to_string(),
        smtp_protocol: 2,
        imap_server: "imap.126.com".to_string(),
        imap_port: 993,
        imap_account: "kuzehibiki@126.com".to_string(),
        imap_password: "IFHXQOCVBMPLJQTD".to_string(),
        imap_protocol: 2,
    });
    let request = ClientRequest {
        command_id: 20001,
        payload: req.encode_to_vec(),
    };
    let response = invoke("/tmp/mytest.socket".to_string(), request)
        .await
        .unwrap();
    let resp = command::UpdateAccountResponse::decode(&*response).unwrap();
    println!("{:?}", resp);
}

#[tokio::test]
pub async fn test_get_account() {
    init_log_server();
    let req = command::GetAccountRequest::default();
    let request = ClientRequest {
        command_id: 20002,
        payload: req.encode_to_vec(),
    };
    let response = invoke("/tmp/mytest.socket".to_string(), request)
        .await
        .unwrap();
    let resp = command::GetAccountResponse::decode(&*response).unwrap();
    println!("{:?}", resp);
}
