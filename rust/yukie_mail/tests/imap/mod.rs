use log::*;
use log4rs;
use tokio;
use yukie_mail::imap;
use yukie_mail::proto::command::{GetMailLabelsRequest, GetMailListRequest};
pub fn init_log_server() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init rust server log");
}

#[tokio::test]
async fn get_mail_labels() {
    init_log_server();
    let req = GetMailLabelsRequest::default();
    let res = yukie_mail::imap::label_services::get_mail_labels(req).await;
    match res {
        Ok(ok) => debug!("{:?}", ok),
        Err(err) => debug!("err:{}", err),
    }
}

#[tokio::test]
async fn get_mail_list() {
    init_log_server();
    let mut req = GetMailListRequest::default();
    req.label = "INBOX".to_string();
    let res = yukie_mail::imap::message_services::get_mail_list_from_db(req).await;
    match res {
        Ok(ok) => debug!("{:?}", ok),
        Err(err) => debug!("err:{}", err),
    }
}

#[tokio::test]
async fn test_decode() {
    let ori = ["&Xn9USpCuTvY-", "&bUuL1Q-", "qaqa"];
    for label in ori {
        let out = utf7_imap::decode_utf7_imap(label.to_string());
        println!("label:{},,,out:{}", label, out);
    }
}
