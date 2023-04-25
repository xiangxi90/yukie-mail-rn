use log::debug;
use log::error;
use log::info;
use log::trace;
use log::warn;
use log4rs;

fn main() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init for log");
    trace!("detailed tracing info");
    debug!("debug info");
    warn!("warning message");
    error!("error message");
    dfs();
}

fn dfs() -> bool {
    info!("fdsfds");
    true
}
