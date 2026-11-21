#[slot]
pub struct Footer {
    children: ChildrenFn,
}

#[component]
fn Card(title: &'static str, #[prop(optional)] footer: Option<Footer>, children: Children) -> impl IntoView {
    view! {
        <section class="card">
            <h2>{title}</h2>
            {children()}
            {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
        </section>
    }
}
