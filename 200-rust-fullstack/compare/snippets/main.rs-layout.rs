fn Layout() -> Element {
    let saved = use_context_provider(|| Signal::new(Vec::<u32>::new()));
    rsx! {
        header {
            Link { class: "brand", to: Route::Home {}, "Trail Guide" }
            span { class: "saved", "★ {saved.read().len()} saved" }
        }
        main {
            SuspenseBoundary {
                fallback: |_| rsx! { p { class: "muted", "Loading…" } },
                Outlet::<Route> {}
            }
        }
    }
}
