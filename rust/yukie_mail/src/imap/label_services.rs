use crate::imap::pool;
use crate::models::MailLabel as DBLabel;
use crate::proto::command::{GetMailLabelResponse, GetMailLabelsRequest, MailLabel};
use anyhow::Result;
use log::debug;
use utf7_imap::decode_utf7_imap;

pub fn is_label_system(label: &str) -> bool {
    const SYSTEM: [&str; 5] = ["INBOX", "SEND", "DRAFT", "TRASH", "SPAM"];
    SYSTEM.contains(&label)
}

pub async fn get_mail_labels(request: GetMailLabelsRequest) -> Result<GetMailLabelResponse> {
    let mut labels = request.labels;
    debug!("[get mail labels] labels:{:?}", labels);
    let mut imap_session = pool::create_session()?;
    let mut response = GetMailLabelResponse::default();
    let mut db_labels = Vec::new();
    // 未主动提供label时，获取所有label信息
    // 否则获取指定label信息
    if labels.is_empty() {
        labels = imap_session
            .list(Some(""), Some("*"))?
            .iter()
            .map(|l| l.name().to_owned())
            .collect::<Vec<String>>();
    }

    for label in labels {
        let info = imap_session.select(&label)?;
        debug!("[get mail labels] mailbox {:?}", info);
        let mut l = MailLabel::default();
        l.label_id = label.clone();
        l.label_name = decode_utf7_imap(label.clone());
        l.unread_count = info.unseen.unwrap_or(0) as i32;
        l.is_system = is_label_system(&l.label_id);
        l.total_count = info.exists as i32;

        let mut db_label = DBLabel::default();
        db_label.id = label;
        db_label.is_system = l.is_system;
        db_label.name = l.label_name.clone();
        db_label.total_count = l.total_count as i64;
        db_label.unread_count = l.unread_count as i64;
        db_label.updated_timestamp_ms = crate::utils::timestamp();

        debug!("[get mail labels] maillabel:{:?}", l);
        response.labels.push(l);
        db_labels.push(db_label);
    }

    crate::db::labels::update_labels_to_db(db_labels)?;
    Ok(response)
}
