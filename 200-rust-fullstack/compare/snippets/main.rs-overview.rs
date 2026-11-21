fn Overview(id: ReadSignal<u32>) -> Element {
    let _ = id;
    let trail = use_context::<TrailResource>();
    let Some(Ok(Some(trail))) = trail() else { return rsx! {} };
    rsx! {
        Card { title: "Overview", footer: rsx! { span { "Kept by the trail club" } },
            p { "{trail.about}" }
        }
    }
}
