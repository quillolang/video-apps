fn App() -> Element {
    let mut name = use_signal(String::new);
    let mut message = use_signal(String::new);
    let mut list = use_server_future(move || entries())?;
    let rows = list.read().as_ref().and_then(|r| r.as_ref().ok()).cloned().unwrap_or_default();

    rsx! {
        document::Title { "Guestbook" }
        h1 { "Guestbook" }
        form {
            onsubmit: move |e: FormEvent| async move {
                e.prevent_default();
                if sign(name(), message()).await.is_ok() {
                    name.set(String::new());
                    message.set(String::new());
                    list.restart();
                }
            },
            input {
                name: "name", placeholder: "Your name", required: true,
                value: "{name}", oninput: move |e| name.set(e.value()),
            }
            input {
                name: "message", placeholder: "Say hello", required: true,
                value: "{message}", oninput: move |e| message.set(e.value()),
            }
            button { "Sign" }
        }
        ul {
            for (n, m) in rows {
                li { b { "{n}" } ": {m}" }
