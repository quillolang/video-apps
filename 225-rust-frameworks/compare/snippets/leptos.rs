fn HomePage() -> impl IntoView {
    let sign = ServerAction::<Sign>::new();
    let entries = Resource::new(move || sign.version().get(), |_| entries());

    view! {
        <h1>"Guestbook"</h1>
        <ActionForm action=sign>
            <input name="name" placeholder="Your name" required/>
            <input name="message" placeholder="Say hello" required/>
            <button>"Sign"</button>
        </ActionForm>
        <Suspense fallback=|| view! { <p>"Loading…"</p> }>
            <ul>
                {move || entries.get().map(|rows| {
                    rows.unwrap_or_default()
                        .into_iter()
                        .map(|(name, message)| view! { <li><b>{name}</b>": "{message}</li> })
                        .collect_view()
                })}
            </ul>
        </Suspense>
