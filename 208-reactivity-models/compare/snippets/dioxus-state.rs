    let mut items = use_signal(items::items);
    let mut filter = use_signal(String::new);
    let mut draft = use_signal(String::new);

    let shown = use_memo(move || {
        let f = filter.read().to_lowercase();
        items.read().iter().filter(|i| i.name.to_lowercase().contains(&f)).cloned().collect::<Vec<_>>()
    });
    let left = use_memo(move || items.read().iter().filter(|i| !i.done).count());
    let total = use_memo(move || items.read().iter().filter(|i| !i.done).map(|i| i.cents * i.qty).sum::<u32>());
