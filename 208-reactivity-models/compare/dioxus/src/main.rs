use dioxus::prelude::*;

mod count;
mod items;
use count::ran;

const GROCERIES_CSS: Asset = asset!("/assets/groceries.css");

#[derive(Clone, PartialEq)]
pub struct Item {
    pub id: u32,
    pub name: String,
    pub cents: u32,
    pub qty: u32,
    pub done: bool,
}

fn money(cents: u32) -> String {
    format!("${}.{:02}", cents / 100, cents % 100)
}

fn main() {
    dioxus::launch(App);
}

#[component]
fn Row(item: Item, on_toggle: EventHandler<u32>, on_remove: EventHandler<u32>) -> Element {
    ran("Row");
    let id = item.id;
    rsx! {
        li { class: if item.done { "done" },
            label {
                input { r#type: "checkbox", checked: item.done, onchange: move |_| on_toggle.call(id) }
                span { class: "name", "{item.name}" }
            }
            span { class: "qty", "×{item.qty}" }
            span { class: "price", "{money(item.cents)}" }
            button { class: "remove", aria_label: "Remove {item.name}", onclick: move |_| on_remove.call(id), "×" }
        }
    }
}

#[component]
fn App() -> Element {
    ran("App");
    let mut items = use_signal(items::items);
    let mut filter = use_signal(String::new);
    let mut draft = use_signal(String::new);

    let shown = use_memo(move || {
        let f = filter.read().to_lowercase();
        items.read().iter().filter(|i| i.name.to_lowercase().contains(&f)).cloned().collect::<Vec<_>>()
    });
    let left = use_memo(move || items.read().iter().filter(|i| !i.done).count());
    let total = use_memo(move || items.read().iter().filter(|i| !i.done).map(|i| i.cents * i.qty).sum::<u32>());

    let toggle = move |id: u32| {
        if let Some(i) = items.write().iter_mut().find(|i| i.id == id) {
            i.done = !i.done;
        }
    };
    let remove = move |id: u32| items.write().retain(|i| i.id != id);
    let add = move |e: FormEvent| {
        e.prevent_default();
        let name = draft.read().trim().to_string();
        if name.is_empty() {
            return;
        }
        let id = items.read().iter().map(|i| i.id).max().unwrap_or(0) + 1;
        items.write().push(Item { id, name, cents: 100, qty: 1, done: false });
        draft.set(String::new());
    };

    rsx! {
        document::Title { "Groceries" }
        document::Link { rel: "stylesheet", href: GROCERIES_CSS }
        main { class: "groceries",
            h1 { "Groceries" }
            form { class: "add", onsubmit: add,
                input { value: "{draft}", oninput: move |e| draft.set(e.value()), placeholder: "Add an item", aria_label: "New item" }
                button { "Add" }
            }
            input { class: "filter", value: "{filter}", oninput: move |e| filter.set(e.value()), placeholder: "Filter", aria_label: "Filter" }
            p { class: "summary", "{left} left · {money(total())}" }
            ul { class: "list",
                for item in shown() {
                    Row { key: "{item.id}", item: item.clone(), on_toggle: toggle, on_remove: remove }
                }
            }
        }
    }
}
