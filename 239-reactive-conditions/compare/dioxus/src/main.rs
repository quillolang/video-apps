use dioxus::prelude::*;

const PAGE_CSS: Asset = asset!("/assets/page.css");

fn main() {
    dioxus::launch(App);
}

#[component]
fn Counter() -> Element {
    let mut n = use_signal(|| 0);
    rsx! {
        div { class: "panel",
            span { class: "count", "Clicked {n}" }
            button { onclick: move |_| n += 1, "+1" }
        }
    }
}

#[component]
fn App() -> Element {
    let mut open = use_signal(|| false);
    let mut status = use_signal(|| "loading");
    let mut unread = use_signal(|| 0);
    let mut joining = use_signal(|| false);
    let mut shown = use_signal(|| true);
    let label = if open() { "Hide details" } else { "Show details" };
    rsx! {
        document::Stylesheet { href: PAGE_CSS }
        main {
            h1 { "Dioxus" }
            section { class: "box box-details",
                h2 { "Details" }
                button { onclick: move |_| open.toggle(), "{label}" }
                if open() {
                    p { class: "out", "Ships in 2 days." }
                }
            }
            section { class: "box box-status",
                h2 { "Status" }
                button { onclick: move |_| status.set("loading"), "Loading" }
                button { onclick: move |_| status.set("error"), "Error" }
                button { onclick: move |_| status.set("ready"), "Ready" }
                p { class: "out",
                    match status() {
                        "loading" => rsx! { em { "Loading…" } },
                        "error" => rsx! { strong { "Couldn't load" } },
                        _ => rsx! { span { "3 messages" } },
                    }
                }
            }
            section { class: "box box-zero",
                h2 { "Unread" }
                button { onclick: move |_| unread += 1, "+1 unread" }
                button { onclick: move |_| unread.set(0), "Read all" }
                p { class: "out",
                    "Inbox"
                    if unread() > 0 {
                        span { class: "badge", "{unread} new" }
                    }
                }
            }
            section { class: "box box-switch wide",
                h2 { "Log in or sign up" }
                button { onclick: move |_| joining.toggle(),
                    if joining() { "I have an account" } else { "I'm new here" }
                }
                if joining() {
                    input { placeholder: "Work email", aria_label: "Work email" }
                } else {
                    input { placeholder: "Your email", aria_label: "Your email" }
                }
            }
            section { class: "box box-keep",
                h2 { "Counter" }
                button { onclick: move |_| shown.toggle(),
                    if shown() { "Hide counter" } else { "Show counter" }
                }
                if shown() {
                    Counter {}
                }
            }
        }
    }
}
