    let onsubmit = {
        let (name, message, load) = (name.clone(), message.clone(), load.clone());
        Callback::from(move |e: SubmitEvent| {
            e.prevent_default();
            let n = name.cast::<HtmlInputElement>().unwrap();
            let m = message.cast::<HtmlInputElement>().unwrap();
            let body = NewEntry { name: n.value(), message: m.value() };
            n.set_value("");
            m.set_value("");
            let load = load.clone();
            wasm_bindgen_futures::spawn_local(async move {
                if Request::post("/api/sign").json(&body).unwrap().send().await.is_ok() {
                    load.emit(());
                }
            });
        })
    };

    html! {
        <>
            <h1>{ "Guestbook" }</h1>
            <form {onsubmit}>
                <input ref={name} name="name" placeholder="Your name" required=true />
                <input ref={message} name="message" placeholder="Say hello" required=true />
                <button>{ "Sign" }</button>
            </form>
            <ul>
                { for entries.iter().map(|e| html! { <li><b>{ &e.name }</b>{ ": " }{ &e.message }</li> }) }
            </ul>
