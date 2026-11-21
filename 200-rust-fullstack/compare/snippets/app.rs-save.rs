fn SaveButton(id: u32) -> impl IntoView {
    let saved = expect_context::<RwSignal<Vec<u32>>>();
    let on = move || saved.read().contains(&id);
    view! {
        <button
            class=move || if on() { "save on" } else { "save" }
            on:click=move |_| {
                if on() { saved.write().retain(|s| *s != id) } else { saved.write().push(id) }
            }
        >
            {move || if on() { "★ Saved" } else { "☆ Save" }}
        </button>
    }
}
