<For
    each=move || { TODOS.iter().filter(|t| show_done.get() || !t.done).cloned().collect::<Vec<_>>() }
    key=|t| t.id
    children=|t| view! { <li>{t.text}</li> }
/>
