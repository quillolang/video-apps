fn Reviews() -> impl IntoView {
    let id = trail_id();
    let list = Resource::new(id, |id| load_reviews(id.unwrap_or_default()));
    view! {
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            {move || Suspend::new(async move {
                list.await.map(|list| {
                    let n = list.len();
                    view! {
                        <Card title="Reviews">
                            <Footer slot>{n} " reviews"</Footer>
                            <ul class="reviews">
                                {list.into_iter().map(|r| view! {
                                    <li>
                                        <b>{r.who}</b> " "
                                        <span class="stars">{"★".repeat(r.stars as usize)}</span>
                                        <p>{r.text}</p>
                                    </li>
                                }).collect_view()}
                            </ul>
                        </Card>
                    }
                })
            })}
        </Suspense>
    }
}
