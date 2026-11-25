    for t in TODOS.iter() {
        if show_done() || !t.done {
            li { key: "{t.id}", "{t.text}" }
        }
    }
}
