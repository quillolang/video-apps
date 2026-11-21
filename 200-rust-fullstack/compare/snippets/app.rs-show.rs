fn Card(title: &'static str, #[prop(optional)] footer: Option<Footer>, children: Children) -> impl IntoView {
    let open = RwSignal::new(true);
    view! {
        <section class="card">
            <h2 on:click=move |_| open.update(|o| *o = !*o)>{title}</h2>
            <Show when=move || open.get()>{children()}</Show>
            {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
        </section>
    }
}
