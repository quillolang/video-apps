use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    routing::get,
};
use serde::Serialize;
use sqlx::SqlitePool;
use tokio::net::TcpListener;

#[derive(Serialize, sqlx::FromRow)]
struct Trail {
    id: i64,
    name: String,
    km: f64,
}

#[tokio::main]
async fn main() {
    let url = "sqlite:trails.db?mode=rwc";
    let pool = SqlitePool::connect(url)
        .await
        .unwrap();
    sqlx::migrate!().run(&pool).await.unwrap();

    let app = Router::new()
        .route("/api/trails", get(trails))
        .with_state(pool);
    let addr = "127.0.0.1:3000";
    let listener = TcpListener::bind(addr)
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn trails(
    State(pool): State<SqlitePool>,
) -> Result<
    Json<Vec<Trail>>,
    (StatusCode, String),
> {
    sqlx::query_as::<_, Trail>(
        "select * from trails order by name",
    )
    .fetch_all(&pool)
    .await
    .map(Json)
    .map_err(internal_error)
}

fn internal_error<E>(
    err: E,
) -> (StatusCode, String)
where
    E: std::error::Error,
{
    let code = StatusCode::INTERNAL_SERVER_ERROR;
    (code, err.to_string())
}
