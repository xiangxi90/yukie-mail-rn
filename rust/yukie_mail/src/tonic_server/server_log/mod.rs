use log::*;
use log4rs;
pub fn init_log_server() {
    log4rs::init_file("configs/log4rs.yaml", Default::default()).unwrap();
    info!("init rust server log");
}
