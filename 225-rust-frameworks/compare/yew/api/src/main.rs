// The guestbook's API for the Yew app: the entries as JSON, a new entry, and the built app (dist/) for everything else.
use axum::{Json, Router, extract::State, http::StatusCode, routing::{get, post}};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tower_http::services::{ServeDir, ServeFile};

type Db = Arc<Mutex<Connection>>;

#[derive(Serialize, Deserialize)]
struct Entry {
    name: String,
    message: String,
}

async fn list(State(db): State<Db>) -> Json<Vec<Entry>> {
    let db = db.lock().unwrap();
    let mut stmt = db.prepare("select name, message from entries order by id desc").unwrap();
    let rows = stmt
        .query_map([], |r| Ok(Entry { name: r.get(0)?, message: r.get(1)? }))
        .unwrap()
        .map(|e| e.unwrap())
        .collect();
    Json(rows)
}

async fn sign(State(db): State<Db>, Json(e): Json<Entry>) -> StatusCode {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    StatusCode::CREATED
}

#[tokio::main]
async fn main() {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    let db: Db = Arc::new(Mutex::new(conn));
    let site = ServeDir::new("dist").fallback(ServeFile::new("dist/index.html"));
    let app = Router::new()
        .route("/api/entries", get(list))
        .route("/api/sign", post(sign))
        .fallback_service(site)
        .with_state(db);
    let port = std::env::var("PORT").unwrap_or("3000".into());
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
