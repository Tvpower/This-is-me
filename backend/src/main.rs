mod db;
mod routes;
mod models;

use rocket::{launch, routes, Build, Rocket};
use rocket_cors::{AllowedOrigins, CorsOptions};
use std::env;

// change localhost ip to my home ip

#[launch]
async fn rocket() -> Rocket<Build> {
    // Load env variables
    dotenv::dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    // Create a db connection pool
    let pool = db::create_pool(&database_url)
        .await
        .expect("Failed to create database pool");

    // Configure CORS for FE
    let cors = CorsOptions::default() //This might need to be removed in a future update bc im using nginx now
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec!["Get", "Post", "Put", "Delete", "Options"]
                .into_iter()
                .map(|s| s.parse().unwrap())
                .collect(),
        )
        .allow_credentials(true)
        .to_cors()
        .expect("Error building CORS");

    rocket::build()
        .manage(pool)
        .attach(cors)
        .mount(
            "/api",
            routes![
                routes::get_all_flowers,
                routes::get_flower,
                routes::create_flower,
                routes::delete_flower,
            ],
        )
}