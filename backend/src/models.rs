use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use time::OffsetDateTime; // had to change this to match with the one on mysql schema

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Flower {
    pub id: String,
    pub x: f64,
    pub y: f64,
    pub name: String,
    pub hours: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<OffsetDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct NewFlower {
    pub id: String,
    pub x: f64,
    pub y: f64,
    pub name: String,
    pub hours: f64,
}
