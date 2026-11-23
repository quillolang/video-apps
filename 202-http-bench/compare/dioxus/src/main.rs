// The HTTP benchmark, Dioxus's side: the same five answers as Quillo's main.qwe, written the way Dioxus 0.7's
// guide writes a fullstack app. /text, /json and /compute are server functions; /fortunes and /db are pages of
// the app, rendered on the server; /db reads SQLite with rusqlite, as the guide's tutorial does.
// Under /axum/ are the same five answers as plain axum routes beside the app (Dioxus's dioxus::serve takes them),
// the table rendered with dioxus-ssr and no hydration: Rust without the fullstack layer, for comparison.
use dioxus::fullstack::Text;
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

#[cfg(not(feature = "server"))]
fn main() {
    dioxus::launch(App);
}

#[cfg(feature = "server")]
fn main() {
    use dioxus::server::axum::{response::Html, routing::get, Json};
    dioxus::serve(|| async move {
        Ok(dioxus::server::router(App)
            .route("/axum/text", get(|| async { "Hello, World!" }))
            .route("/axum/json", get(|| async { Json(Message { message: "Hello, World!".to_string() }) }))
            .route("/axum/fortunes", get(|| async { Html(plain_page(fortunes())) }))
            .route("/axum/db", get(|| async { Html(plain_page(db_fortunes().unwrap_or_default())) }))
            .route("/axum/compute", get(|| async {
                Json(Total { total: work(std::hint::black_box(10000)) })
            })))
    })
}

// The table alone, rendered once with dioxus-ssr: no app around it, nothing to hydrate.
#[cfg(feature = "server")]
fn plain_page(list: Vec<Fortune>) -> String {
    let mut dom = VirtualDom::new_with_props(Rows, RowsProps { list });
    dom.rebuild_in_place();
    let table = dioxus::ssr::render(&dom);
    format!("<!doctype html><html><head><title>Fortunes</title></head><body>{table}</body></html>")
}

#[derive(Debug, Clone, Routable, PartialEq)]
enum Route {
    #[route("/fortunes")]
    Fortunes {},
    #[route("/db")]
    Db {},
}

#[component]
fn App() -> Element {
    rsx! { Router::<Route> {} }
}

#[derive(Clone, PartialEq, Serialize, Deserialize)]
struct Message { message: String }

// Text: a String alone would go out as JSON, in quotes.
#[get("/text")]
async fn text() -> Result<Text<String>> {
    Ok(Text("Hello, World!".to_string()))
}

#[get("/json")]
async fn json() -> Result<Message> {
    Ok(Message { message: "Hello, World!".to_string() })
}

// TechEmpower's Fortunes: the list, one more added for this request, sorted, as an HTML table.
#[derive(Clone, PartialEq, Serialize, Deserialize)]
struct Fortune { id: i64, message: String }

const FORTUNES: [(i64, &str); 12] = [
    (1, "fortune: No such file or directory"),
    (2, "A computer scientist is someone who fixes things that aren't broken."),
    (3, "After enough decimal places, nobody gives a damn."),
    (4, "A bad random number generator: 1, 1, 1, 1, 1, 4.33e+67, 1, 1, 1"),
    (5, "A computer program does what you tell it to do, not what you want it to do."),
    (6, "Emacs is a nice operating system, but I prefer UNIX. — Tom Christaensen"),
    (7, "Any program that runs right is obsolete."),
    (8, "A list is only as strong as its weakest link. — Donald Knuth"),
    (9, "Feature: A bug with seniority."),
    (10, "Computers make very fast, very accurate mistakes."),
    (11, "<script>alert(\"This should not be displayed in a browser alert box.\");</script>"),
    (12, "フレームワークのベンチマーク"),
];

#[component]
fn Table(list: Vec<Fortune>) -> Element {
    rsx! {
        document::Title { "Fortunes" }
        Rows { list }
    }
}

#[component]
fn Rows(list: Vec<Fortune>) -> Element {
    let mut all = list.clone();
    all.push(Fortune { id: 0, message: "Additional fortune added at request time.".to_string() });
    all.sort_by(|a, b| a.message.cmp(&b.message));
    rsx! {
        table {
            tr { th { "id" } th { "message" } }
            for f in all {
                tr { td { "{f.id}" } td { "{f.message}" } }
            }
        }
    }
}

fn fortunes() -> Vec<Fortune> {
    FORTUNES.iter().map(|(id, m)| Fortune { id: *id, message: m.to_string() }).collect()
}

#[component]
fn Fortunes() -> Element {
    rsx! { Table { list: fortunes() } }
}

// The same page, its fortunes read from SQLite: one connection for each server thread.
#[cfg(feature = "server")]
thread_local! {
    static DB: rusqlite::Connection = rusqlite::Connection::open("fortunes.db").expect("fortunes.db");
}

#[cfg(feature = "server")]
fn db_fortunes() -> rusqlite::Result<Vec<Fortune>> {
    DB.with(|db| {
        let mut q = db.prepare_cached("select id, message from fortune")?;
        let rows = q.query_map([], |r| Ok(Fortune { id: r.get(0)?, message: r.get(1)? }))?;
        rows.collect()
    })
}

#[get("/api/fortunes")]
async fn read_fortunes() -> Result<Vec<Fortune>> {
    Ok(db_fortunes()?)
}

#[component]
fn Db() -> Element {
    let list = use_server_future(read_fortunes)?;
    let list = list().unwrap()?;
    rsx! { Table { list } }
}

// Work in the language itself: a loop of arithmetic.
fn work(n: i64) -> i64 {
    let mut total = 0;
    for i in 0..n {
        total = (total + i * i) % 1000003;
    }
    total
}

#[derive(Clone, PartialEq, Serialize, Deserialize)]
struct Total { total: i64 }

#[get("/compute")]
async fn compute() -> Result<Total> {
    // black_box: the compiler can't work the answer out ahead of time; it runs on each request, as in Quillo.
    Ok(Total { total: work(std::hint::black_box(10000)) })
}
