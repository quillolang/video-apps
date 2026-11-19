use dioxus::prelude::*;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let mut count = use_signal(|| 0);
    let doubled = count() * 2;

    rsx! {
        button {
            onclick: move |_| count += 1,
            "{doubled}"
        }
        p { "{count} doubled is {doubled}" }
    }
}
