fn Missing(what: &'static str) -> impl IntoView {
    // On the server, the answer's status becomes 404.
    #[cfg(feature = "ssr")]
    if let Some(response) = use_context::<leptos_axum::ResponseOptions>() {
        response.set_status(axum::http::StatusCode::NOT_FOUND);
    }
    view! {
        <Title text=what/>
        <h1 class="missing">"404: " {what}</h1>
        <a href="/">"← All trails"</a>
    }
}
