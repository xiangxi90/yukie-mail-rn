use std::println;

use aes_gcm::{
    aead::{Aead, KeyInit, Payload},
    Aes256Gcm,
    KeySizeUser, // Or `Aes128Gcm`
    Nonce,
};
use anyhow::Result;

pub struct Cipher {
    key: Vec<u8>, // 加密密钥
    nonce: Vec<u8>,
}

impl Cipher {
    pub fn new(key: String, nonce: String) -> Self {
        Self {
            key: key.into_bytes(),
            nonce: nonce.into_bytes(),
        }
    }

    pub fn encrypt(&self, plain_text: &str) -> Result<String> {
        println!(
            "keysize:{},KEYlen:{},nonce len:{}",
            Aes256Gcm::key_size(),
            self.key.len(),
            self.nonce.len()
        );
        let chiper = Aes256Gcm::new_from_slice(&self.key).unwrap();
        let payload = Payload {
            msg: plain_text.as_bytes(),
            aad: "yukie_mail_rn".as_bytes(),
        };
        let nonce = Nonce::from_slice(&self.nonce);
        let chiper_text = chiper.encrypt(nonce, payload).unwrap_or_default();
        Ok(unsafe { String::from_utf8_unchecked(chiper_text) })
    }

    pub fn decrypt(&self, cipher_text: &str) -> Result<String> {
        let chiper = Aes256Gcm::new_from_slice(&self.key).unwrap();
        let payload = Payload {
            msg: cipher_text.as_bytes(),
            aad: "yukie_mail_rn".as_bytes(),
        };
        let nonce = Nonce::from_slice(&self.nonce);
        let plain_text = chiper.decrypt(nonce, payload).unwrap_or_default();
        Ok(unsafe { String::from_utf8_unchecked(plain_text) })
    }
}

pub fn aes_gcm_chiper_encrypt(plain_text: &str) -> Result<String> {
    let cipher = Cipher::new(
        "fdsafggasdfgdsafdfdsafggasdfgdsa".to_owned(),
        "gsgfssgdsggf".to_owned(),
    );
    cipher.encrypt(plain_text)
}

pub fn aes_gcm_chiper_decrypt(plain_text: &str) -> Result<String> {
    let cipher = Cipher::new(
        "fdsafggasdfgdsafdfdsafggasdfgdsa".to_owned(),
        "gsgfssgdsggf".to_owned(),
    );
    cipher.decrypt(plain_text)
}

#[test]
fn test_cipher() {
    let cipher = Cipher::new(
        "fdsafggasdfgdsafdfdsafggasdfgdsa".to_owned(),
        "gsgfssgdsggf".to_owned(),
    );
    let plaint = "ceshi";
    let cpt = cipher.encrypt(plaint).unwrap();
    let plt = cipher.decrypt(&cpt).unwrap();
    println!("plt1:{},plt2:{},cpt:{}", plaint, plt, cpt);
}
