use crate::db::pool::DB_POOL;
use crate::models::MailLabelMessage;
use crate::models::MailMessageBody;
use crate::models::MailMessageInfo;
use crate::schema::mail_label_message::dsl::{self as mail_label_message_dsl, mail_label_message};
use crate::schema::mail_message_body::dsl::{self as mail_nessage_body_dsl, mail_message_body};
use crate::schema::mail_message_info::dsl::{self as mail_message_info_dsl, mail_message_info};
use anyhow::{Context, Result};
use diesel::prelude::*;

pub fn update_messages_info_to_db(messages: Vec<MailMessageInfo>) -> Result<()> {
    let mut conn = DB_POOL.clone().get()?;
    let _res = diesel::replace_into(mail_message_info)
        .values(messages)
        .execute(&mut conn);
    Ok(())
}

pub fn update_messages_body_to_db(messages: Vec<MailMessageBody>) -> Result<()> {
    let mut conn = DB_POOL.clone().get()?;
    let _res = diesel::replace_into(mail_message_body)
        .values(messages)
        .execute(&mut conn);
    Ok(())
}

pub fn get_message_infos(message_id: &[String]) -> Result<Vec<MailMessageInfo>> {
    let mut conn = DB_POOL.clone().get()?;
    let infos = mail_message_info
        .filter(mail_message_info_dsl::id.eq_any(message_id))
        .load::<MailMessageInfo>(&mut conn)?;
    Ok(infos)
}

pub fn get_message_bodys(message_id: &[String]) -> Result<Vec<MailMessageBody>> {
    let mut conn = DB_POOL.clone().get()?;
    let infos = mail_message_body
        .filter(mail_nessage_body_dsl::id.eq_any(message_id))
        .load::<MailMessageBody>(&mut conn)?;
    Ok(infos)
}

pub fn get_message_ids_by_label(label_id: &str) -> Result<Vec<String>> {
    let mut conn = DB_POOL.clone().get()?;
    let message_ids = mail_label_message
        .select(mail_label_message_dsl::message_id)
        .filter(mail_label_message_dsl::label_id.eq(label_id))
        .load(&mut conn)?;
    Ok(message_ids)
}
