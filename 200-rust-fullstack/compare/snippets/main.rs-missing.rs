fn Missing(what: String) -> Element {
    // On the server, the answer's status becomes 404.
    FullstackContext::commit_http_status(StatusCode::NOT_FOUND, None);
    rsx! {
        document::Title { "{what}" }
        h1 { class: "missing", "404: {what}" }
        Link { to: Route::Home {}, "← All trails" }
    }
}
