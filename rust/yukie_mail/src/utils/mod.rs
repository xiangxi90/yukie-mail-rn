use crate::imap::pool::ImapConnectPool;
use anyhow::Result;
use log::*;
use native_tls::Certificate;
use native_tls::Identity;
use std::io::Read;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

pub mod aes_gcm;
// 避免全局变量管理混乱，最后都在这边申请吧qwq
lazy_static! {
    static ref KEYS: Keys = openssl_keys().unwrap();
    static ref IMAP_POOL: Mutex<ImapConnectPool> = Mutex::new(ImapConnectPool::new());
}

#[derive(Debug, Clone, Default)]
pub struct Keys {
    pub cert_der: Vec<u8>,
    pub pkey_der: Vec<u8>,
    pub pkcs12_der: Vec<u8>,
    pub der: Vec<u8>,
}

impl Keys {
    fn get_cert(&self) -> &[u8] {
        &self.cert_der
    }
    fn get_pkey(&self) -> &[u8] {
        &self.pkey_der
    }
    fn get_pkcs12(&self) -> &[u8] {
        &self.pkcs12_der
    }
    fn get_der(&self) -> &[u8] {
        &self.der
    }
}

fn openssl_keys() -> Result<Keys> {
    let mut cer = Vec::new();
    let mut pkey = Vec::new();
    let mut pkcs = Vec::new();
    let mut der = Vec::new();
    std::fs::File::open("./0.cer")?.read(&mut cer)?;
    std::fs::File::open("./0.key")?.read(&mut pkey)?;
    std::fs::File::open("./0.pfx")?.read(&mut pkcs)?;
    std::fs::File::open("./0.der")?.read(&mut der)?;
    debug!("[keys] init keys success");
    Ok(Keys {
        cert_der: cer,
        pkey_der: pkey,
        pkcs12_der: pkcs,
        der,
    })
}

pub fn get_keys() -> &'static Keys {
    &KEYS
}

pub fn get_identity() -> Result<Identity> {
    let keys = get_keys();
    let cert = keys.get_pkcs12();
    Ok(Identity::from_pkcs12(cert, "20010116")?)
}

pub fn get_certificate() -> Result<Certificate> {
    let cert = get_keys().get_cert();
    Ok(Certificate::from_der(cert)?)
}

pub fn timestamp() -> i64 {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let ms = since_the_epoch.as_secs() as i64 * 1000i64
        + (since_the_epoch.subsec_nanos() as f64 / 1_000_000.0) as i64;
    ms
}
