use rocket::{State, serde::json::Json, http::Status};
use sqlx::MySqlPool;
use rocket::{get, post, delete};
use crate::models::{Flower, NewFlower};

/// Get all flowers
#[get("/flowers")]
pub async fn get_all_flowers(pool: &State<MySqlPool>) -> Result<Json<Vec<Flower>>, Status> {
    let flowers = sqlx::query_as::<_, Flower>(
        "SELECT id, x, y, name, hours, created_at FROM flowers ORDER BY created_at DESC"
    )
        .fetch_all(pool.inner())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            Status::InternalServerError
        })?;

    Ok(Json(flowers))
}

// Ge a single flower by ID
#[get("/flowers/<id>")]
pub async fn get_flower(id: String, pool: &State<MySqlPool>) -> Result<Json<Flower>, Status> {
    let flower = sqlx::query_as::<_, Flower>(
        "SELECT id, x, y , name, hours, created_at FROM flowers WHERE id = ?"
    )
        .bind(&id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            Status::NotFound
        })?;

    Ok(Json(flower))
}

/// Create a new flower
#[post("/flowers", format = "json", data = "<flower>")]
pub async fn create_flower(
    flower: Json<NewFlower>,
    pool: &State<MySqlPool>
) -> Result<Json<Flower>, Status> {
    let result = sqlx::query(
        "INSERT INTO flowers (id, x, y, name, hours) VALUES (?, ?, ?, ?, ?)"
    )
        .bind(&flower.id)
        .bind(&flower.x)
        .bind(&flower.y)
        .bind(&flower.name)
        .bind(&flower.hours)
        .execute(pool.inner())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            Status::InternalServerError
        })?;

    if result.rows_affected() == 0 {
        return Err(Status::InternalServerError);
    }

    let created_flower = sqlx::query_as::<_, Flower>(
        "SELECT id, x, y, name, hours, created_at FROM flowers WHERE id = ?"
    )
        .bind(&flower.id)
        .fetch_one(pool.inner())
        .await
        .map_err(|_| {
            Status::InternalServerError
        })?;

    Ok(Json(created_flower))
}

/// Delete flower
#[delete("/flowers/<id>")]
pub async fn delete_flower(id: String, pool: &State<MySqlPool>) -> Result<Status, Status> {
    let result =sqlx::query("DELETE FROM flowers WHERE id = ?")
        .bind(&id)
        .execute(pool.inner())
        .await
        .map_err(|e| {
            eprintln!("Database error: {}", e);
            Status::InternalServerError
        })?;

    if result.rows_affected() == 0 {
        return Err(Status::NotFound);
    }

    Ok(Status::NoContent)
}