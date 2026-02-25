use sqlx::mysql::{ MySqlPool, MySqlPoolOptions };
use std::time::Duration;

pub async fn create_pool(db_url: &str) -> Result<MySqlPool, sqlx::Error> {
    MySqlPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(db_url)
        .await
}