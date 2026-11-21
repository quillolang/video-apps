fn Home() -> impl IntoView {
    let trails = Resource::new(|| (), |_| list_trails());
    view! {
        <Title text="Trail Guide"/>
        <h1>"Trails"</h1>
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            <ul class="trails">
                {move || Suspend::new(async move {
                    trails.await.map(|list| {
                        list.into_iter().map(|t| view! { <TrailItem trail=t/> }).collect_view()
                    })
                })}
            </ul>
        </Suspense>
    }
}
