use crate::db::labels::get_mail_labels_by_message_id;
use crate::db::messages::get_message_bodys;
use crate::imap::message_services;
use crate::proto::command;
use crate::proto::mail_base;
use anyhow::Result;

pub async fn get_mail_list(
    req: command::GetMailListRequest,
) -> Result<command::GetMailListResponse> {
    if let Ok(resp) = message_services::get_mail_list_from_net(req.clone()).await {
        Ok(resp)
    } else {
        Ok(message_services::get_mail_list_from_db(req).await?)
    }
}

pub async fn get_mail_message(
    req: command::GetMailMessageRequest,
) -> Result<command::GetMailMessageResponse> {
    let mut resp = command::GetMailMessageResponse::default();

    let request = command::GetMailListRequest {
        label: req.label,
        last_uid: String::new(),
    };
    let infos = if let Ok(resp) = message_services::get_mail_list_from_net(request.clone()).await {
        resp.message_info
    } else {
        message_services::get_mail_list_from_db(request)
            .await?
            .message_info
    };

    for info in infos {
        if !req.message_id.contains(&info.id) {
            continue;
        }
        let mail_body = get_message_bodys(&vec![info.id.clone()])?
            .pop()
            .unwrap_or_default();
        let labels = get_mail_labels_by_message_id(&mail_body.id)?;
        let message_full = command::MessageFull {
            id: mail_body.id,
            message_info: Some(info),
            body: String::from_utf8(mail_body.body)?,
            labels,
        };
        resp.message_full.push(message_full);
    }
    Ok(resp)
}
