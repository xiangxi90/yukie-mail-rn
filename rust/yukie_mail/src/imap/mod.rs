pub mod label_services;
pub mod message_services;
pub mod pool;

use crate::proto::command::{
    GetMailLabelResponse, GetMailLabelsRequest, GetMailListRequest, GetMailListResponse, MailLabel,
};
// use crate::utils::get_certificate;
use anyhow::Result;

use imap;

pub async fn get_mail_list(request: GetMailListRequest) -> Result<GetMailListResponse> {
    let label = request.label;
    let last_uid = request.last_uid;

    let mut imap_session = pool::create_session()?;

    let mailbox = imap_session.select(label)?;

    let mut response = GetMailListResponse::default();
    Ok(response)
}

// use async_imap;
// use futures::TryStreamExt;
// use log::*;
// use std::sync::Arc;
// use tokio::net::TcpStream;
// mod pool;

// pub async fn fetch_inbox_top(
//     imap_server: &str,
//     username: &str,
//     password: &str,
//     port: u16,
// ) -> Result<Option<String>> {
//     let imap_addr = (imap_server, port);
//     let tcp_stream = TcpStream::connect(imap_addr).await?;
//     let cert = get_certificate()?;
//     let tls = async_native_tls::TlsConnector::new();

//     let tls_stream = tls.connect(imap_server, tcp_stream).await?;
//     debug!("tls connect success");

//     let client = async_imap::Client::new(tls_stream);
//     debug!("-- connected to {}:{}", imap_addr.0, imap_addr.1);

//     // the client we have here is unauthenticated.
//     // to do anything useful with the e-mails, we need to log in
//     let mut imap_session = client.login(username, password).await.map_err(|e| e.0)?;
//     debug!("-- logged in a {}", username);

//     // we want to fetch the first email in the INBOX mailbox
//     imap_session.select("INBOX").await?;
//     debug!("-- INBOX selected");

//     // fetch message number 1 in this mailbox, along with its RFC822 field.
//     // RFC 822 dictates the format of the body of e-mails
//     let messages_stream = imap_session.fetch("1", "RFC822").await?;
//     let messages: Vec<_> = messages_stream.try_collect().await?;
//     let message = if let Some(m) = messages.first() {
//         m
//     } else {
//         debug!("no mail in mailbox:{}", "INBOX");
//         return Ok(None);
//     };

//     // extract the message's body
//     let body = message.body().expect("message did not have a body!");
//     let body = std::str::from_utf8(body)
//         .expect("message was not valid utf-8")
//         .to_string();
//     debug!("-- 1 message received, logging out");

//     // be nice to the server and log out
//     imap_session.logout().await?;

//     Ok(Some(body))
// }
