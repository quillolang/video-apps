fn Rows(list: Vec<Fortune>) -> Element {
    let mut all = list.clone();
    all.push(Fortune { id: 0, message: "Additional fortune added at request time.".to_string() });
    all.sort_by(|a, b| a.message.cmp(&b.message));
    rsx! {
        table {
            tr { th { "id" } th { "message" } }
            for f in all {
                tr { td { "{f.id}" } td { "{f.message}" } }
            }
        }
    }
}
