fn TrailPage() -> impl IntoView {
    let id = trail_id();
    let trail: TrailResource = Resource::new(id, |id| async move {
        match id { Some(id) => load_trail(id).await, None => Ok(None) }
    });
    provide_context(trail);   // the tabs below read the same trail
    view! {
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            {move || Suspend::new(async move {
                match trail.await {
                    Ok(Some(t)) => view! {
                        <Title text=format!("{} · Trail Guide", t.name)/>
                        <h1>{t.name.clone()} " " <Badge level=t.level.clone()/></h1>
                        <nav class="tabs">
                            <A href=format!("/trails/{}", t.id) exact=true>"Overview"</A>
                            <A href=format!("/trails/{}/reviews", t.id)>"Reviews"</A>
                            <SaveButton id=t.id/>
                        </nav>
                        <Outlet/>
                    }.into_any(),
                    _ => view! { <Missing what="No such trail"/> }.into_any(),
                }
            })}
        </Suspense>
    }
}
