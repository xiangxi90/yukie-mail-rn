#[macro_use]
extern crate lazy_static;

pub mod db;
pub mod imap;
pub mod proto;
pub mod smtp;
pub mod utils;

mod models;
mod schema;

#[cfg(not(target_os = "windows"))]
pub mod client;
#[cfg(not(target_os = "windows"))]
pub mod server;
#[cfg(not(target_os = "windows"))]
pub mod tonic_server;
