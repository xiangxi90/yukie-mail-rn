use log::*;
use log4rs;
use prost::Message;
use yukie_mail::client::{invoke, ClientRequest};
use yukie_mail::proto::command;
use yukie_mail::tonic_server::start_server;
fn main() {
    debug!("start server");
    start_server(8, "/tmp/mytest.socket");
}
