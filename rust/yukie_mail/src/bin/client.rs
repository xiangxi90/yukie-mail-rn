use log::*;
use log4rs;
use prost::Message;
use yukie_mail::client::{invoke, ClientRequest};
use yukie_mail::proto::command;
use yukie_mail::tonic_server::start;
#[tokio::main]
async fn main() {
    init_log_server();

    debug!("start client");
    let mut request = command::GetMailLabelsRequest::default();
    request.labels = vec!["INBOX".to_string()];

    let req = ClientRequest {
        command_id: 10001,
        payload: request.encode_to_vec(),
    };

    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    let response = invoke("/tmp/mytest.socket".to_string(), req).await.unwrap();
    let resp = command::GetMailLabelResponse::decode(&*response).unwrap();
    println!("{:?}", resp);
}

pub fn init_log_server() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init rust server log");
}
