use sycamore::prelude::*;

#[component]
fn App() -> View {
    let mut count = create_signal(0i32);
    let doubled = move || count.get() * 2;
    let increment = move |_| count += 1;
    view! {
        button(on:click=increment) { (doubled) }
        p { (count) " doubled is " (doubled) }
    }
}

fn main() {
    sycamore::render(App);
}
