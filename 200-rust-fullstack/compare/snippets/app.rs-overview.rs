fn Overview() -> impl IntoView {
    let trail = expect_context::<TrailResource>();
    view! {
        <Suspense fallback=|| ()>
            {move || Suspend::new(async move {
                trail.await.map(|t| t.map(|t| view! {
                    <Card title="Overview">
                        <Footer slot>"Kept by the trail club"</Footer>
                        <p>{t.about}</p>
                    </Card>
                }))
            })}
        </Suspense>
    }
}
