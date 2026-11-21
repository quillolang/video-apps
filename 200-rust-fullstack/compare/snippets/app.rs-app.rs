pub fn App() -> impl IntoView {
    provide_meta_context();
    // The saved trails, for the header and every Save button, through context.
    let saved = RwSignal::new(Vec::<u32>::new());
    provide_context(saved);

    view! {
        <Stylesheet id="leptos" href="/pkg/trails.css"/>
        <Title text="Trail Guide"/>
        <Router>
            <header>
                <a class="brand" href="/">"Trail Guide"</a>
                <span class="saved">"★ " {move || saved.read().len()} " saved"</span>
            </header>
            <main>
                <Routes fallback=|| view! { <Missing what="No such page"/> }>
                    <Route path=path!("/") view=Home/>
                    <ParentRoute path=path!("/trails/:id") view=TrailPage>
                        <Route path=path!("") view=Overview/>
                        <Route path=path!("reviews") view=Reviews/>
                    </ParentRoute>
                </Routes>
            </main>
        </Router>
    }
}
