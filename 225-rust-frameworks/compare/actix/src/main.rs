// The guestbook in Actix Web: a form, and every entry, newest first, kept in SQLite.
use actix_web::{App, HttpResponse, HttpServer, get, http::header, post, web};
use rusqlite::Connection;
use serde::Deserialize;
use std::sync::Mutex;

type Db = web::Data<Mutex<Connection>>;

#[derive(Deserialize)]
struct Entry {
    name: String,
    message: String,
}

fn esc(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

#[get("/")]
async fn index(db: Db) -> HttpResponse {
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
    HttpResponse::Ok().content_type("text/html; charset=utf-8").body(format!(
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

#[post("/sign")]
async fn sign(db: Db, e: web::Form<Entry>) -> HttpResponse {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    HttpResponse::SeeOther().insert_header((header::LOCATION, "/")).finish()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    let db = web::Data::new(Mutex::new(conn));
    let port: u16 = std::env::var("PORT").unwrap_or("3000".into()).parse().unwrap();
    HttpServer::new(move || App::new().app_data(db.clone()).service(index).service(sign))
        .bind(("127.0.0.1", port))?
        .run()
        .await
}
