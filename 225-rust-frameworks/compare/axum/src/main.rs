// The guestbook in Axum: a form, and every entry, newest first, kept in SQLite.
use axum::{Form, Router, extract::State, response::{Html, Redirect}, routing::{get, post}};
use rusqlite::Connection;
use serde::Deserialize;
use std::sync::{Arc, Mutex};

type Db = Arc<Mutex<Connection>>;

#[derive(Deserialize)]
struct Entry {
    name: String,
    message: String,
}

fn esc(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

async fn index(State(db): State<Db>) -> Html<String> {
    let db = db.lock().unwrap();
    let mut stmt = db.prepare("select name, message from entries order by id desc").unwrap();
    let items: String = stmt
        .query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))
        .unwrap()
        .map(|e| {
            let (name, message) = e.unwrap();
            format!("<li><b>{}</b>: {}</li>", esc(&name), esc(&message))
        })
        .collect();
    Html(format!(
        r#"<!doctype html><html><head><title>Guestbook</title></head><body>
<h1>Guestbook</h1>
<form method="post" action="/sign">
<input name="name" placeholder="Your name" required>
<input name="message" placeholder="Say hello" required>
<button>Sign</button>
</form>
<ul>{items}</ul>
</body></html>"#
    ))
}

async fn sign(State(db): State<Db>, Form(e): Form<Entry>) -> Redirect {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    Redirect::to("/")
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
    let app = Router::new().route("/", get(index)).route("/sign", post(sign)).with_state(db);
    let port = std::env::var("PORT").unwrap_or("3000".into());
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
