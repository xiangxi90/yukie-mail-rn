use crate::db::pool::DB_POOL;
use crate::models::{MailLabel, MailLabelMessage};
use crate::schema::mail_label::dsl::{self as mail_label_dsl, mail_label};
use crate::schema::mail_label_message::dsl::{self as mail_label_message_dsl, mail_label_message};
use crate::utils::timestamp;
use anyhow::{Context, Result};
use diesel::prelude::*;

pub fn update_labels_to_db(mail_labels: Vec<MailLabel>) -> Result<()> {
    let mut conn = DB_POOL.clone().get()?;

    let _res = diesel::replace_into(mail_label)
        .values(mail_labels)
        .execute(&mut conn);

    Ok(())
}

pub fn update_mail_label_message_to_db(label_message: Vec<MailLabelMessage>) -> Result<()> {
    let mut conn = DB_POOL.clone().get()?;

    let _res = diesel::replace_into(mail_label_message)
        .values(label_message)
        .execute(&mut conn);

    Ok(())
}

pub fn get_mail_labels_by_label_id(labels: &Vec<String>) -> Result<Vec<MailLabel>> {
    let mut conn = DB_POOL.clone().get()?;

    let labels = mail_label
        .filter(mail_label_dsl::id.eq_any(labels))
        .load::<MailLabel>(&mut conn)?;
    Ok(labels)
}

pub fn get_all_mail_labels() -> Result<Vec<MailLabel>> {
    let mut conn = DB_POOL.clone().get()?;

    let labels = mail_label.load::<MailLabel>(&mut conn)?;
    Ok(labels)
}

pub fn get_mail_labels_by_message_id(message_id: &str) -> Result<Vec<String>> {
    let mut conn = DB_POOL.clone().get()?;

    let labels = mail_label_message
        .select(mail_label_message_dsl::label_id)
        .filter(mail_label_message_dsl::message_id.eq(message_id))
        .load::<String>(&mut conn)?;
    Ok(labels)
}
