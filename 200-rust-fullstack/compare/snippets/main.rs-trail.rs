fn TrailPage(id: ReadSignal<u32>) -> Element {
    let trail: TrailResource = use_server_future(move || load_trail(id()))?;
    use_context_provider(|| trail);   // the tabs below read the same trail
    let Some(trail) = trail().unwrap()? else {
        return rsx! { Missing { what: "No such trail" } };
    };
    let id = id();
    rsx! {
        document::Title { "{trail.name} · Trail Guide" }
        h1 { "{trail.name} " Badge { level: trail.level.clone() } }
        nav { class: "tabs",
            Link { to: Route::Overview { id }, active_class: "active", "Overview" }
            Link { to: Route::Reviews { id }, active_class: "active", "Reviews" }
            SaveButton { id }
        }
        Outlet::<Route> {}
    }
}
