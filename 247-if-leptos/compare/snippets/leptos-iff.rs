{move || if unread.get() == 0 {
    view! { <span>"All read"</span> }.into_any()
} else if unread.get() == 1 {
    view! { <span>"1 new message"</span> }.into_any()
} else {
    view! { <strong>{unread.get()} " new messages"</strong> }.into_any()
}}
