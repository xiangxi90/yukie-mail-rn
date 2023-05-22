use crate::db::labels::{get_all_mail_labels, get_mail_labels_by_label_id};
use crate::models;
use crate::proto::command;
use crate::proto::mail_base;
use anyhow::Result;
pub fn get_mail_labels(labels: Vec<String>) -> Result<Vec<command::MailLabel>> {
    let res = if labels.is_empty() {
        get_all_mail_labels()?
    } else {
        get_mail_labels_by_label_id(&labels)?
    };
    Ok(res
        .into_iter()
        .map(|label| convert_db_label_to_client_label(label))
        .collect::<Vec<command::MailLabel>>())
}

pub fn convert_db_label_to_client_label(db_label: models::MailLabel) -> command::MailLabel {
    command::MailLabel {
        label_id: db_label.id,
        unread_count: db_label.unread_count as i32,
        total_count: db_label.total_count as i32,
        is_system: db_label.is_system,
        label_name: db_label.name,
    }
}
