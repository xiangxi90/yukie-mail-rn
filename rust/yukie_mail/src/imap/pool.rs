use crate::db::account::{get_mail_account_from_db, ServerType};
use anyhow::{bail, Result};
use imap;
use imap::Session;
use log::debug;
use rustls_connector::TlsStream as RustlsStream;
use std::net::TcpStream;

pub type ImapSession = Session<RustlsStream<TcpStream>>;
/// 连接需要的优先级
/// High时从连接池一次没拿到连接时，会直接获取新的连接
/// Medium则是试探三次
/// Low则会一直等待
#[derive(Debug)]
pub enum ConnectLevel {
    High,
    Medium,
    Low,
}

#[derive(Debug)]
pub struct ImapConnectPool {
    /// nums用于维护具体的连接数，而非线程池中存在的连接数
    /// 避免连接过多，导致后续连接都直接被禁止
    nums: i32,
    pool: Vec<ImapSession>,
}

impl ImapConnectPool {
    pub fn new() -> Self {
        Self {
            nums: 0,
            pool: Vec::new(),
        }
    }

    fn create_session(&mut self) -> Result<()> {
        let account = get_mail_account_from_db(ServerType::Imap)?;
        let mut client = imap::ClientBuilder::new(
            account.address.unwrap_or_default(),
            account.port.unwrap_or_default().try_into().unwrap(),
        );
        if account.protocol.unwrap_or_default() == "starttls" {
            client.starttls();
        }
        let session = client
            .rustls()?
            .login(
                account.account.unwrap_or_default(),
                account.password.unwrap_or_default(),
            )
            .map_err(|e| e.0)?;
        self.nums += 1;
        self.pool.push(session);
        Ok(())
    }

    pub fn get_session(&mut self) -> Result<ImapSession> {
        let mut session;
        let mut retry = 0;
        loop {
            // 当连接池中没由可以用的线程时，就创建新的连接
            // 这里存在一定性能隐患：可能要重复检测多次
            // 但目前线程池中做多8条线程，应该还好？
            // !!!!! 这里有死循环可能：网络一直错误时，会死循环
            if self.nums <= 0 || self.pool.len() <= 0 {
                self.create_session()?;
                retry += 1;
            }
            // 已经做过了检测，故而直接unwrap即可
            let mut ses = self.pool.pop().unwrap();
            if ses.check().is_ok() {
                session = ses;
                break;
            }
            if retry >= 10 {
                bail!("connect failed , please check your net");
            }
        }
        Ok(session)
    }

    pub fn add_session(&mut self, session: ImapSession) {
        self.pool.push(session);
    }
}

pub fn create_session() -> Result<ImapSession> {
    let account = get_mail_account_from_db(ServerType::Imap)?;
    debug!("[imap create session] get account success :{:?}", account);
    let mut client = imap::ClientBuilder::new(
        account.address.unwrap_or_default(),
        account.port.unwrap_or_default().try_into().unwrap(),
    );
    if account.protocol.unwrap_or_default() == "starttls" {
        client.starttls();
    }
    let session = client
        .rustls()?
        .login(
            account.account.unwrap_or_default(),
            account.password.unwrap_or_default(),
        )
        .map_err(|e| e.0)?;
    Ok(session)
}
