fn SaveButton(id: u32) -> Element {
    let mut saved = use_context::<Signal<Vec<u32>>>();
    let on = saved.read().contains(&id);
    rsx! {
        button {
            class: if on { "save on" } else { "save" },
            onclick: move |_| {
                if on { saved.write().retain(|s| *s != id) } else { saved.write().push(id) }
            },
            if on { "★ Saved" } else { "☆ Save" }
        }
    }
}
