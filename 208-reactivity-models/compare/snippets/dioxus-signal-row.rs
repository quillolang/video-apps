fn Row(item: Item, items: Signal<Vec<Item>>) -> Element {
    ran("Row");
    let id = item.id;
    let mut items = items;
    let mut on_toggle = move |id: u32| {
        if let Some(i) = items.write().iter_mut().find(|i| i.id == id) {
            i.done = !i.done;
        }
    };
    let mut on_remove = move |id: u32| items.write().retain(|i| i.id != id);
