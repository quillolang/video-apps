// The guestbook in Axum, tuned: a SQLite connection per thread (WAL, so reads don't wait for each other), and
// statements prepared once and cached. Everything else as in ../axum.
use axum::{Form, Router, response::{Html, Redirect}, routing::{get, post}};
use rusqlite::Connection;
use serde::Deserialize;
use std::cell::RefCell;

thread_local! {
    static DB: RefCell<Connection> = RefCell::new({
        let conn = Connection::open("guestbook.db").unwrap();
        conn.pragma_update(None, "journal_mode", "wal").unwrap();
        conn.busy_timeout(std::time::Duration::from_secs(5)).unwrap();
        conn
    });
}

#[derive(Deserialize)]
struct Entry {
    name: String,
    message: String,
}

fn esc(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

async fn index() -> Html<String> {
    let items: String = DB.with_borrow(|db| {
        let mut stmt = db.prepare_cached("select name, message from entries order by id desc").unwrap();
        stmt.query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))
            .unwrap()
            .map(|e| {
                let (name, message) = e.unwrap();
                format!("<li><b>{}</b>: {}</li>", esc(&name), esc(&message))
            })
            .collect()
    });
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

async fn sign(Form(e): Form<Entry>) -> Redirect {
    DB.with_borrow(|db| {
        db.prepare_cached("insert into entries (name, message) values (?1, ?2)").unwrap().execute((&e.name, &e.message)).unwrap();
    });
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
    drop(conn);
    let app = Router::new().route("/", get(index)).route("/sign", post(sign));
    let port = std::env::var("PORT").unwrap_or("3000".into());
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
