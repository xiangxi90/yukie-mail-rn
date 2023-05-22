use diesel::prelude::*;

use crate::schema::*;

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_label_message)]
pub struct MailLabelMessage {
    pub(crate) label_id: String,
    pub(crate) message_id: String,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_label)]
pub struct MailLabel {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) is_system: bool,
    pub(crate) updated_timestamp_ms: i64,
    pub(crate) unread_count: i64,
    pub(crate) total_count: i64,
    pub(crate) raw_id: Option<String>,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_message_body)]
pub struct MailMessageBody {
    pub(crate) id: String,
    pub(crate) attachment_json: String,
    pub(crate) body: Vec<u8>,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_message_info)]
pub struct MailMessageInfo {
    pub(crate) id: String,
    pub(crate) reply_to_id: String,
    pub(crate) subject: String,
    pub(crate) from: String,
    pub(crate) to: String,
    pub(crate) cc: String,
    pub(crate) bcc: String,
    pub(crate) json: String,
    pub(crate) created_time: i64,
    pub(crate) summary: String,
    pub(crate) flaged: Option<bool>,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_cmd_status)]
pub struct MailCmdStatus {
    pub(crate) task_id: i32,
    pub(crate) create_time: i64,
    pub(crate) cmd: String,
    pub(crate) task_time: i64,
    pub(crate) status: i32,
    pub(crate) message_id: String,
    pub(crate) add_labels: String,
    pub(crate) remove_labels: String,
    pub(crate) deleted: bool,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = mail_calendar)]
pub struct MailCalendar {
    pub(crate) id: String,
    pub(crate) start_time: i64,
    pub(crate) end_time: i64,
    pub(crate) title: String,
    pub(crate) context: String,
    pub(crate) message_id: String,
}

#[derive(Queryable, Selectable, Insertable, Debug, Default, Clone)]
#[diesel(table_name = server_account)]
pub struct ServerAccount {
    pub(crate) server_type: Option<String>,
    pub(crate) account: Option<String>,
    pub(crate) password: Option<String>,
    pub(crate) protocol: Option<String>,
    pub(crate) address: Option<String>,
    pub(crate) port: Option<i32>,
    pub(crate) name: Option<String>,
}
