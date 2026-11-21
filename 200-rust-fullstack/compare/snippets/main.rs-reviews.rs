fn Reviews(id: ReadSignal<u32>) -> Element {
    let list = use_server_future(move || load_reviews(id()))?;
    let list = list().unwrap()?;
    rsx! {
        Card { title: "Reviews", footer: rsx! { span { "{list.len()} reviews" } },
            ul { class: "reviews",
                for r in list {
                    li { key: "{r.who}",
                        b { "{r.who}" }
                        " "
                        span { class: "stars", {"★".repeat(r.stars as usize)} }
                        p { "{r.text}" }
                    }
                }
            }
        }
    }
}
