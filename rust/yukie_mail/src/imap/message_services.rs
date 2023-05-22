use std::format;

use crate::db::labels::update_mail_label_message_to_db;
use crate::db::messages::{
    get_message_ids_by_label, get_message_infos, update_messages_body_to_db,
    update_messages_info_to_db,
};
use crate::imap::pool;
use crate::models::{MailLabelMessage, MailMessageBody, MailMessageInfo};
use crate::proto::command::{
    GetMailListRequest, GetMailListResponse, GetMailMessageRequest, GetMailMessageResponse,
    MessageInfo,
};
use crate::proto::mail_base::MailAddress;
use anyhow::Result;
use log::debug;
use mailparse::{addrparse, MailAddr, MailHeaderMap};

pub async fn get_mail_list_from_db(request: GetMailListRequest) -> Result<GetMailListResponse> {
    let label_id = request.label;
    let uid_last = request.last_uid;

    let message_ids = get_message_ids_by_label(&label_id)?;

    let message_infos = get_message_infos(&message_ids)?;

    let mut response = GetMailListResponse::default();
    response.message_count = (message_infos.len() + 1) as i32;
    response.message_info = message_infos
        .iter()
        .map(|info| db_mail_info_to_client(info.clone()))
        .collect();

    Ok(response)
}

pub async fn get_mail_list_from_net(request: GetMailListRequest) -> Result<GetMailListResponse> {
    let label_id = request.label;
    let uid_last = request.last_uid;

    let mut imap_session = pool::create_session()?;
    let mailbox = imap_session.select(&label_id)?;

    let mut mails = imap_session.search("ALL")?.into_iter().collect::<Vec<_>>();
    mails.sort();
    // let mut mail_uids = mails
    //     .iter()
    //     .map(|uid| format!("{} ", uid))
    //     .collect::<String>();
    // mail_uids.pop();
    let mail_uids = format!(
        "{}:{}",
        mails.first().unwrap_or(&0),
        mails.last().unwrap_or(&1)
    );
    debug!("[get mail list] uids:{}", mail_uids);

    // let mail_infos = imap_session.fetch(mail_uids, "RFC822")?;

    let mut response = GetMailListResponse::default();

    for label in mails {
        let mail_infos = imap_session.fetch(format!("{}", label), "RFC822")?;
        for mail_info in mail_infos.iter().by_ref() {
            let parsed_mail = parsed_imap_message(mail_info, &label_id)?;
            debug!("[get mail list] parsed mail:{:?}", parsed_mail);
            response.message_info.push(parsed_mail);
        }
    }

    Ok(response)
}

fn parsed_imap_message(message: &imap::types::Fetch, label: &str) -> Result<MessageInfo> {
    let parsed = mailparse::parse_mail(message.body().unwrap()).unwrap();

    for h in &parsed.headers {
        debug!("  [{}] => [{}]", h.get_key(), h.get_value());
    }

    let subject = parsed
        .headers
        .get_first_value("Subject")
        .unwrap_or("No Subject".to_string());

    let date_header = parsed.headers.get_first_value("Date").unwrap_or_default();
    let timestamp = mailparse::dateparse(&date_header)?;

    let from_header = parsed.headers.get_first_value("From").unwrap_or_default();
    let parsed_header = &addrparse(&from_header).unwrap_or(default_mil_addr())[0];
    let from: MailAddress = match parsed_header {
        MailAddr::Single(info) => MailAddress {
            name: info.display_name.clone().unwrap_or_default(),
            address: info.addr.clone(),
        },
        _ => panic!(),
    };

    let to_header = parsed.headers.get_first_value("To").unwrap_or_default();
    let tos = if !to_header.is_empty() {
        let parsed_to = &addrparse(&to_header).unwrap_or(default_mil_addr())[0];
        match parsed_to {
            MailAddr::Single(info) => vec![MailAddress {
                name: info.display_name.clone().unwrap_or_default(),
                address: info.addr.clone(),
            }],
            MailAddr::Group(infos) => infos
                .addrs
                .iter()
                .map(|info| MailAddress {
                    name: info.display_name.clone().unwrap_or_default(),
                    address: info.addr.clone(),
                })
                .collect(),
        }
    } else {
        Vec::new()
    };

    let cc_header = parsed.headers.get_first_value("Cc").unwrap_or_default();
    let ccs: Vec<MailAddress> = if !cc_header.is_empty() {
        let parsed_cc = &addrparse(&cc_header).unwrap_or(default_mil_addr())[0];
        match parsed_cc {
            MailAddr::Single(info) => vec![MailAddress {
                name: info.display_name.clone().unwrap_or_default(),
                address: info.addr.clone(),
            }],
            MailAddr::Group(infos) => infos
                .addrs
                .iter()
                .map(|info| MailAddress {
                    name: info.display_name.clone().unwrap_or_default(),
                    address: info.addr.clone(),
                })
                .collect(),
        }
    } else {
        Vec::new()
    };

    let bcc_header = parsed.headers.get_first_value("Bcc").unwrap_or_default();
    let bccs = if !bcc_header.is_empty() {
        let parsed_bcc = &addrparse(&bcc_header).unwrap_or(default_mil_addr())[0];
        match parsed_bcc {
            MailAddr::Single(info) => vec![MailAddress {
                name: info.display_name.clone().unwrap_or_default(),
                address: info.addr.clone(),
            }],
            MailAddr::Group(infos) => infos
                .addrs
                .iter()
                .map(|info| MailAddress {
                    name: info.display_name.clone().unwrap_or_default(),
                    address: info.addr.clone(),
                })
                .collect(),
        }
    } else {
        Vec::new()
    };

    let mut body = parsed.get_body().unwrap();
    if parsed.ctype.mimetype == "multipart/alternative" {
        println!("body = {}", parsed.get_body().unwrap());
        for part in parsed.subparts {
            if part.ctype.mimetype == "text/plain" || part.ctype.mimetype == "text/html" {
                println!("sub mime = {}", part.ctype.mimetype);
                println!("sub body = {}", part.get_body().unwrap());
                body.push_str(&part.get_body()?);
            }
        }
    }

    let message_id = parsed
        .headers
        .get_first_value("Message-ID")
        .unwrap_or_default();

    let mut mail_body = MailMessageBody::default();
    mail_body.body = body.as_bytes().to_vec();
    mail_body.id = message_id.clone();
    update_messages_body_to_db(vec![mail_body])?;

    let mut mail_info = MailMessageInfo::default();
    mail_info.id = message_id.clone();
    mail_info.subject = subject.clone();
    mail_info.from = serde_json::to_string(&from)?;
    mail_info.to = serde_json::to_string(&tos)?;
    mail_info.bcc = serde_json::to_string(&bccs)?;
    mail_info.cc = serde_json::to_string(&ccs)?;
    mail_info.created_time = timestamp;
    update_messages_info_to_db(vec![mail_info])?;

    let mut label_message = MailLabelMessage::default();
    label_message.label_id = label.to_owned();
    label_message.message_id = message_id.clone();
    update_mail_label_message_to_db(vec![label_message])?;
    // let text = std::str::from_utf8(message.text().unwrap()).unwrap();
    // let fragment = Html::parse_fragment(text);
    // let selector = Selector::parse("h1").unwrap();

    // let h1 = fragment.select(&selector).next().unwrap();
    // let text = h1.text().collect::<Vec<_>>().join(" ");

    Ok(MessageInfo {
        id: message_id,
        reply_to_id: String::new(),
        subject,
        from: Some(from),
        to: tos,
        cc: ccs,
        bcc: bccs,
        create_time: timestamp,
        summary: String::new(),
        flaged: false,
    })
}

fn default_mil_addr() -> mailparse::MailAddrList {
    mailparse::MailAddrList::from(vec![MailAddr::Single(mailparse::SingleInfo {
        display_name: None,
        addr: String::new(),
    })])
}

pub fn db_mail_info_to_client(mail_info: MailMessageInfo) -> MessageInfo {
    let mut info = MessageInfo::default();
    info.id = mail_info.id;
    info.from = serde_json::from_str(&mail_info.from).unwrap_or_default();
    info.to = serde_json::from_str(&mail_info.to).unwrap_or_default();
    info.cc = serde_json::from_str(&mail_info.cc).unwrap_or_default();
    info.bcc = serde_json::from_str(&mail_info.bcc).unwrap_or_default();
    info.subject = mail_info.subject;
    info.flaged = mail_info.flaged.is_some();
    info.summary = mail_info.summary;
    info
}
