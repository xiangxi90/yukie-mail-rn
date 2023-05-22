use anyhow::Result;
use log::debug;
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{UnixListener, UnixStream};
use tokio::sync::broadcast::*;
use tokio::sync::Notify;
use tokio::task::JoinHandle;
mod server_log;

pub struct Server {
    #[allow(dead_code)]
    pub tx: Sender<String>,
    pub rx: Receiver<String>,
    pub address: Arc<PathBuf>,
    pub handle: Option<JoinHandle<Result<()>>>,
    pub abort: Arc<Notify>,
}

impl Server {
    pub fn new<P: AsRef<Path>>(address: P) -> Self {
        let (tx, rx) = channel::<String>(400);
        let address = Arc::new(address.as_ref().to_path_buf());

        Self {
            address,
            handle: None,
            tx,
            rx,
            abort: Arc::new(Notify::new()),
        }
    }
}

/// 初始化创建服务进程，启动uds服务
/// 根据传入thread nums来确认服务最大线程数
pub fn start_server(thread_nums: usize, socket_path: &str) -> Result<()> {
    tokio::runtime::Builder::new_multi_thread()
        .worker_threads(thread_nums)
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
            let mut server = Server::new(socket_path);
            start(&mut server).await?;
            Ok(())
        })
}

/// Start Server
pub async fn start(server: &mut Server) -> Result<()> {
    server_log::init_log_server();
    // 开始前先保证文件不存在，避免绑定错误
    tokio::fs::remove_file(server.address.as_path()).await.ok();

    let listener = UnixListener::bind(server.address.as_path())?;

    debug!("[Server] Started");

    let tx = server.tx.clone();
    let abort = server.abort.clone();
    server.handle = Some(tokio::spawn(async move {
        loop {
            let tx = tx.clone();
            let abort1 = abort.clone();
            tokio::select! {
                // 收到abort信号时停止监听
                _ = abort.notified() => break,
                // 否则继续监听
                Ok((client, _)) = listener.accept() => {
                    // 从连接处无法获取客户端地址，无法从此处拦截用户
                    tokio::spawn(async move { handle(client, tx, abort1).await });
                }
            }
        }
        debug!("[Server] Aborted!");

        Ok(())
    }));

    Ok(())
}

/// Handle stream
/// 存在多种连接模式，根据command id来进行分配
/// 1. request & response 模式，客户端连接后，服务端恢复后即可断开
/// 2. callback模式，客户端需要一直保持该长连接，接收push
async fn handle(mut stream: UnixStream, tx: Sender<String>, abort: Arc<Notify>) {
    let buf_reader = BufReader::new(&mut stream);

    // let client_request = buf_reader.
    let mut buf = Vec::new();
    stream.read_buf(&mut buf).await;
    loop {
        let mut rx = tx.subscribe();
        let abort = abort.clone();
        let mut buffer = String::new();
        //let task =
        // stream.read_to_string(&mut buffer).await.unwrap_or_default();
        //debug!("[server read string] {}", buffer);
        tokio::select! {
            _ = abort.notified() => break,
            result = rx.recv() => match result {
                Ok(output) => {
                    stream.write_all(output.as_bytes()).await.unwrap();
                    stream.write(b"\n").await.unwrap();
                    continue;
                }
                Err(e) => {
                    debug!("handle [Server error] {e}");
                    break;
                }
            }
        }
    }
}

/// Connect to server
pub async fn connect(address: Arc<PathBuf>, name: String) -> Vec<String> {
    let mut outputs = vec![];
    let mut stream = UnixStream::connect(&*address).await.unwrap();
    stream.write_all("echo".as_bytes()).await.unwrap();
    let mut breader = BufReader::new(stream);
    let mut buf = vec![];
    loop {
        if let Ok(len) = breader.read_buf(&mut buf).await {
            if len == 0 {
                break;
            } else {
                let value = String::from_utf8(buf.clone()).unwrap();
                debug!("connect [{name}] {value}");
                outputs.push(value);
            };

            buf.clear();
        }
    }

    debug!("connect [{name}] ENDED");
    outputs
}

/// Feed data
pub fn feed(tx: Sender<String>, abort: Arc<Notify>) -> Result<JoinHandle<Result<()>>> {
    use tokio::io::*;
    use tokio::process::Command;
    Ok(tokio::spawn(async move {
        let mut child = Command::new("echo")
            .args(&["1\n", "2\n", "3\n", "4\n"])
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .stdin(Stdio::null())
            .spawn()?;
        let mut stdout = BufReader::new(child.stdout.take().unwrap()).lines();
        loop {
            let sender = tx.clone();
            tokio::select! {
                result = stdout.next_line() => match result {
                    Err(e) => {
                        debug!("[Server feed] FAILED to send an output to channel: {e}");
                    },
                    Ok(None) => break,
                    Ok(Some(output)) => {
                        let output = output.trim().to_string();
                        debug!("[Server feed] {output}");
                        if !output.is_empty() {
                            if let Err(e) = sender.send(output) {
                                debug!("[Server feed] FAILED to send an output to channel: {e}");
                            }
                        }
                    }
                }
            }
        }

        debug!("[Server feed] Process Completed");
        abort.notify_waiters();

        Ok(())
    }))
}
