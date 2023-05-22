use anyhow::Result;
use diesel::connection::SimpleConnection;
use diesel::prelude::*;
use diesel::r2d2::ConnectionManager;
use diesel::r2d2::Pool;
use std::env;
use std::time::Duration;

lazy_static! {
    pub static ref DB_POOL: DbPool = get_connection_pool().unwrap();
}

const MAX_DB_CONNECT: u32 = 10;
const MAX_TIME_OUT: u64 = 30;
pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

#[derive(Debug)]
pub struct ConnectionOptions {
    pub enable_wal: bool,
    pub enable_foreign_keys: bool,
    pub busy_timeout: Option<Duration>,
}

impl diesel::r2d2::CustomizeConnection<SqliteConnection, diesel::r2d2::Error>
    for ConnectionOptions
{
    fn on_acquire(&self, conn: &mut SqliteConnection) -> Result<(), diesel::r2d2::Error> {
        (|| {
            if self.enable_wal {
                conn.batch_execute("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;")?;
            }
            if self.enable_foreign_keys {
                conn.batch_execute("PRAGMA foreign_keys = ON;")?;
            }
            if let Some(d) = self.busy_timeout {
                conn.batch_execute(&format!("PRAGMA busy_timeout = {};", d.as_millis()))?;
            }
            Ok(())
        })()
        .map_err(diesel::r2d2::Error::QueryError)
    }
}

pub fn get_connection_pool() -> Result<DbPool> {
    let url = database_url_for_env()?;
    let manager = ConnectionManager::<SqliteConnection>::new(url);
    Ok(Pool::builder()
        .max_size(MAX_DB_CONNECT)
        .connection_customizer(Box::new(ConnectionOptions {
            enable_wal: true,
            enable_foreign_keys: false,
            busy_timeout: Some(Duration::from_secs(MAX_TIME_OUT)),
        }))
        .test_on_check_out(true)
        .build(manager)?)
}

fn database_url_for_env() -> Result<String> {
    dotenvy::dotenv()?;
    Ok(env::var("DATABASE_URL").expect("DATABASE_URL must be set"))
}
