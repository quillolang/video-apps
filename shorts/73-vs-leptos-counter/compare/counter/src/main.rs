use leptos::prelude::*;

fn main() {
    leptos::mount::mount_to_body(App)
}

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = signal(0);
    let doubled = move || count.get() * 2;

    view! {
        <button on:click=move |_| {
            *set_count.write() += 1
        }>
            {doubled}
        </button>
        <p>{count} " doubled is " {doubled}</p>
    }
}
