fn Badge(level: String) -> impl IntoView {
    view! { <span class=format!("badge {level}")>{level.clone()}</span> }
}
