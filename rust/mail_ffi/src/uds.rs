use dotenvy::dotenv;
use std::env;
use std::os::unix::net::UnixStream;

/// 使用该mod与工作线程之间进行通信
///

pub fn invoke() -> Result<String, String> {
    dotenv().ok();
    let socket_path = env::var("UNIX_DOMAIN_SOCKET").expect("UNIX_DOMAIN_SOCKET must be set");
    let mut stream = UnixStream::connect(socket_path).expect("stream connect failed");

    Ok("fdsfds".to_string())
}

pub fn server() -> Result<(), ()> {
    dotenv().ok();
    let socket_path = env::var("UNIX_DOMAIN_SOCKET")?;

    Ok(())
}
