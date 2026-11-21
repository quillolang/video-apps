fn Home() -> Element {
    let trails = use_server_future(list_trails)?;
    let trails = trails().unwrap()?;
    rsx! {
        document::Title { "Trail Guide" }
        h1 { "Trails" }
        ul { class: "trails",
            for t in trails {
                TrailItem { key: "{t.id}", trail: t }
            }
        }
    }
}
