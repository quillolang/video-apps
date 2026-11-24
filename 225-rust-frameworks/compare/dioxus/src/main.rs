// The guestbook in Dioxus: a form, and every entry, newest first, kept in SQLite.
use dioxus::prelude::*;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let mut name = use_signal(String::new);
    let mut message = use_signal(String::new);
    let mut list = use_server_future(move || entries())?;
    let rows = list.read().as_ref().and_then(|r| r.as_ref().ok()).cloned().unwrap_or_default();

    rsx! {
        document::Title { "Guestbook" }
        h1 { "Guestbook" }
        form {
            onsubmit: move |e: FormEvent| async move {
                e.prevent_default();
                if sign(name(), message()).await.is_ok() {
                    name.set(String::new());
                    message.set(String::new());
                    list.restart();
                }
            },
            input { name: "name", placeholder: "Your name", required: true, value: "{name}", oninput: move |e| name.set(e.value()) }
            input { name: "message", placeholder: "Say hello", required: true, value: "{message}", oninput: move |e| message.set(e.value()) }
            button { "Sign" }
        }
        ul {
            for (n, m) in rows {
                li { b { "{n}" } ": {m}" }
            }
        }
    }
}

#[cfg(feature = "server")]
static DB: std::sync::LazyLock<std::sync::Mutex<rusqlite::Connection>> = std::sync::LazyLock::new(|| {
    let conn = rusqlite::Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    std::sync::Mutex::new(conn)
});

#[get("/api/entries")]
async fn entries() -> Result<Vec<(String, String)>, ServerFnError> {
    let db = DB.lock().unwrap();
    let mut stmt = db
        .prepare("select name, message from entries order by id desc")
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    let rows = stmt
        .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))
        .and_then(|rows| rows.collect::<Result<Vec<_>, _>>())
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    Ok(rows)
}

#[post("/api/sign")]
async fn sign(name: String, message: String) -> Result<(), ServerFnError> {
    let db = DB.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&name, &message))
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    Ok(())
}
