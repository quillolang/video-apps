use dioxus::prelude::*;
use gloo_timers::future::TimeoutFuture;

const PAGE_CSS: Asset = asset!("/assets/page.css");

struct Todo {
    id: u32,
    text: &'static str,
    done: bool,
}

const TODOS: [Todo; 3] = [
    Todo { id: 1, text: "Milk", done: true },
    Todo { id: 2, text: "Bread", done: false },
    Todo { id: 3, text: "Eggs", done: false },
];

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let mut unread = use_signal(|| 0);
    let mut running = use_signal(|| false);
    let mut speed = use_signal(|| 100u32);
    let mut ticks = use_signal(|| 0);
    let mut show_done = use_signal(|| false);
    let mut joining = use_signal(|| false);

    let _ticker = use_resource(move || async move {
        if !running() {
            return;
        }
        let ms = speed();
        loop {
            TimeoutFuture::new(ms).await;
            ticks += 1;
        }
    });

    rsx! {
        document::Stylesheet { href: PAGE_CSS }
        main {
            h1 { "Dioxus" }
            section { class: "box box-if",
                h2 { "Unread" }
                button { onclick: move |_| unread += 1, "+1 unread" }
                button { onclick: move |_| unread.set(0), "Read all" }
                p { class: "out",
                    if unread() == 0 {
                        span { "All read" }
                    } else if unread() == 1 {
                        span { "1 new message" }
                    } else {
                        strong { "{unread} new messages" }
                    }
                }
            }
            section { class: "box box-timer",
                h2 { "Ticker" }
                button { onclick: move |_| running.toggle(),
                    if running() { "Stop" } else { "Start" }
                }
                button { onclick: move |_| speed /= 2, "Faster" }
                p { class: "out", "{ticks} ticks" }
                if running() {
                    input { placeholder: "A note, while it runs", aria_label: "Note" }
                }
            }
            section { class: "box box-list",
                h2 { "Shopping" }
                label {
                    input { r#type: "checkbox", checked: show_done(), onchange: move |e| show_done.set(e.checked()) }
                    " Show done"
                }
                ul {
                    for t in TODOS.iter() {
                        if show_done() || !t.done {
                            li { key: "{t.id}", "{t.text}" }
                        }
                    }
                }
            }
            section { class: "box box-one",
                h2 { "Log in or sign up" }
                button { onclick: move |_| joining.toggle(),
                    if joining() { "I have an account" } else { "I'm new here" }
                }
                input { placeholder: if joining() { "Work email" } else { "Your email" }, aria_label: "Email" }
            }
        }
    }
}
