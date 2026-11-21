fn Card(title: String, footer: Option<Element>, children: Element) -> Element {
    rsx! {
        section { class: "card",
            h2 { "{title}" }
            {children}
            if let Some(f) = footer {
                footer { {f} }
            }
        }
    }
}
