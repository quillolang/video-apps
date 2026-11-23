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
