// The guestbook in Yew: a form, and every entry, newest first, from the API in api/ (which keeps them in SQLite).
use gloo_net::http::Request;
use serde::{Deserialize, Serialize};
use web_sys::HtmlInputElement;
use yew::prelude::*;

#[derive(Clone, PartialEq, Deserialize)]
struct Entry {
    name: String,
    message: String,
}

#[derive(Serialize)]
struct NewEntry {
    name: String,
    message: String,
}

#[function_component]
fn App() -> Html {
    let entries = use_state(Vec::<Entry>::new);
    let name = use_node_ref();
    let message = use_node_ref();

    let load = {
        let entries = entries.clone();
        Callback::from(move |_: ()| {
            let entries = entries.clone();
            wasm_bindgen_futures::spawn_local(async move {
                if let Ok(r) = Request::get("/api/entries").send().await {
                    if let Ok(list) = r.json::<Vec<Entry>>().await {
                        entries.set(list);
                    }
                }
            });
        })
    };
    {
        let load = load.clone();
        use_effect_with((), move |_| load.emit(()));
    }

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
        </>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
