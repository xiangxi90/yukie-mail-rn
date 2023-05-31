use log::*;
use log4rs;

use android_logger::Config;
use log::Level;

#[cfg(target_os = "android")]
pub fn init_log_server() {
    android_logger::init_once(
        Config::default()
            .with_min_level(Level::Info)
            .with_tag("my-app"),
    );
}

#[cfg(not(target_os = "android"))]
pub fn init_log_server() {
    log4rs::init_file(
        "/data/data/com.yukie_mail_rn/configs/log4rs.yaml",
        Default::default(),
    )
    .unwrap();
    info!("init rust server log");
}

#[macro_export]
macro_rules! error {
  ($($args:tt)*) => {{
    log::error!("Rust: {}", format!($($args)*));
  }}
}

#[macro_export]
macro_rules! warn {
  ($($args:tt)*) => {{
    log::warn!("Rust: {}", format!($($args)*));
  }}
}

#[macro_export]
macro_rules! info {
  ($($args:tt)*) => {{
    log::info!("Rust: {}", format!($($args)*));
  }}
}

#[macro_export]
macro_rules! debug {
  ($($args:tt)*) => {{
    log::debug!("Rust: {}", format!($($args)*));
  }}
}

#[macro_export]
macro_rules! trace {
  ($($args:tt)*) => {{
    log::trace!("Rust: {}", format!($($args)*));
  }}
}
