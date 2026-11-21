fn NotFound(segments: Vec<String>) -> Element {
    let _ = segments;
    rsx! { Missing { what: "No such page" } }
}
