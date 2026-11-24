// The guestbook in Rocket: a form, and every entry, newest first, kept in SQLite.
#[macro_use]
extern crate rocket;
use rocket::{State, form::Form, response::{Redirect, content::RawHtml}};
use rusqlite::Connection;
use std::sync::Mutex;

type Db = Mutex<Connection>;

#[derive(FromForm)]
struct Entry {
    name: String,
    message: String,
}

fn esc(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

#[get("/")]
fn index(db: &State<Db>) -> RawHtml<String> {
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
    RawHtml(format!(
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

#[post("/sign", data = "<e>")]
fn sign(db: &State<Db>, e: Form<Entry>) -> Redirect {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    Redirect::to(uri!(index))
}

#[launch]
fn rocket() -> _ {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    rocket::build().manage(Mutex::new(conn)).mount("/", routes![index, sign])
}
