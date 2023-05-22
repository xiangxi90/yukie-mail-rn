use crate::db::pool::DB_POOL;
use crate::models::ServerAccount;
use crate::schema::server_account::dsl::{self, server_account};
use crate::utils;
use anyhow::{Context, Result};
use diesel::prelude::*;
pub enum ServerType {
    Imap,
    Smtp,
}

impl ServerType {
    pub fn to_string(&self) -> String {
        let s = match self {
            ServerType::Imap => "imap",
            ServerType::Smtp => "smtp",
        };
        s.to_string()
    }
}

pub fn get_mail_account_from_db(server_type: ServerType) -> Result<ServerAccount> {
    let mut conn = DB_POOL.clone().get()?;

    let mut account: ServerAccount = server_account
        .filter(dsl::server_type.eq(server_type.to_string()))
        .load::<ServerAccount>(&mut conn)?
        .pop()
        .context("get account from db failed")?;

    account.password = Some(utils::aes_gcm::aes_gcm_chiper_decrypt(
        &account.password.unwrap_or_default(),
    )?);

    Ok(account)
}

pub fn update_mail_account(server_type: ServerType, account: ServerAccount) -> Result<()> {
    let mut conn = DB_POOL.clone().get()?;

    let _res = diesel::replace_into(server_account)
        .values(vec![account])
        .execute(&mut conn);

    Ok(())
}
