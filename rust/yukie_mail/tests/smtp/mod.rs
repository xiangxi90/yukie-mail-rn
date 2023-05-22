use log::*;
use log4rs;
use tokio;
use yukie_mail::{
    proto::{command::SendMailRequest, mail_base::MailAddress},
    smtp,
};
pub fn init_log_server() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init rust server log");
}

#[tokio::test]
async fn test_send_mail() {
    init_log_server();
    let mut send_mail_request = SendMailRequest::default();
    send_mail_request.subject = String::from("Test Tokio1-rustls");
    send_mail_request.from = Some(MailAddress {
        name: String::from("cjl"),
        address: String::from("kuzehibiki@126.com"),
    });

    send_mail_request.to.push(MailAddress {
        name: String::from("cjl"),
        address: String::from("2651171386@qq.com"),
    });
    send_mail_request.body = std::fs::read_to_string("./test_mail.html").unwrap();
    // send_mail_request.deliver_time = 5;
    debug!("{:#?}", send_mail_request);
    let res = smtp::send_mail(send_mail_request).await;
    match res {
        Ok(_) => debug!("smtp test pass"),
        Err(err) => debug!("err:{:?}", err),
    }
}
