use crate::db::account::{get_mail_account_from_db, update_mail_account, ServerType};
use crate::models::ServerAccount;
use crate::proto::command::{self, UpdateAccountRequest};
use crate::proto::mail_base;
use crate::utils::aes_gcm::aes_gcm_chiper_encrypt;
use anyhow::Result;
use log::debug;
pub fn mail_update_mail_account(request: UpdateAccountRequest) -> Result<()> {
    if let Some(account) = request.account {
        let imap_account = ServerAccount {
            server_type: Some("imap".to_string()),
            account: Some(account.imap_account),
            password: Some(aes_gcm_chiper_encrypt(&account.imap_password)?),
            protocol: Some(
                mail_base::MailProtocal::from_i32(account.imap_protocol)
                    .unwrap_or_default()
                    .as_str_name()
                    .to_string(),
            ),
            address: Some(account.imap_server),
            port: Some(account.imap_port),
            name: match account.mail_address.clone() {
                Some(a) => Some(a.name),
                None => None,
            },
        };
        let smtp_account = ServerAccount {
            server_type: Some("smtp".to_string()),
            account: Some(account.smtp_account),
            password: Some(aes_gcm_chiper_encrypt(&account.smtp_password)?),
            protocol: Some(
                mail_base::MailProtocal::from_i32(account.smtp_protocol)
                    .unwrap_or_default()
                    .as_str_name()
                    .to_string(),
            ),
            address: Some(account.smtp_server),
            port: Some(account.smtp_port),
            name: match account.mail_address {
                Some(a) => Some(a.name),
                None => None,
            },
        };
        update_mail_account(ServerType::Imap, imap_account)?;
        update_mail_account(ServerType::Smtp, smtp_account)?;
    }
    Ok(())
}

pub fn mail_get_account() -> Result<mail_base::Account> {
    debug!("[mail get account]");
    let imap_account = get_mail_account_from_db(ServerType::Imap)?;
    debug!("[mail get account]imap account:{:?}", imap_account);
    let smtp_account = get_mail_account_from_db(ServerType::Smtp)?;
    debug!("[mail get account]smtp account:{:?}", smtp_account);
    let account = mail_base::Account {
        mail_address: Some(mail_base::MailAddress {
            name: imap_account.name.clone().unwrap_or_default(),
            address: imap_account.account.clone().unwrap_or_default(),
        }),
        status: 0,
        smtp_server: smtp_account.address.unwrap_or_default(),
        smtp_account: smtp_account.account.unwrap_or_default(),
        smtp_port: smtp_account.port.unwrap_or_default(),
        smtp_password: smtp_account.password.unwrap_or_default(),
        smtp_protocol: mail_base::MailProtocal::from_str_name(
            &smtp_account.protocol.unwrap_or_default(),
        )
        .unwrap_or_default() as i32,
        imap_server: imap_account.address.unwrap_or_default(),
        imap_port: imap_account.port.unwrap_or_default(),
        imap_account: imap_account.account.unwrap_or_default(),
        imap_password: imap_account.password.unwrap_or_default(),
        imap_protocol: mail_base::MailProtocal::from_str_name(
            &imap_account.protocol.unwrap_or_default(),
        )
        .unwrap_or_default() as i32,
    };
    Ok(account)
}
