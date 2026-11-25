use std::time::Duration;

use leptos::prelude::*;

#[derive(Clone)]
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
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}

#[component]
fn App() -> impl IntoView {
    let (unread, set_unread) = signal(0);
    let (running, set_running) = signal(false);
    let (speed, set_speed) = signal(100u64);
    let (ticks, set_ticks) = signal(0);
    let (show_done, set_show_done) = signal(false);
    let (joining, set_joining) = signal(false);

    Effect::new(move |_| {
        if running.get() {
            set_interval(move || *set_ticks.write() += 1, Duration::from_millis(speed.get()));
        }
    });

    view! {
        <main>
            <h1>"Leptos"</h1>
            <section class="box box-if">
                <h2>"Unread"</h2>
                <button on:click=move |_| *set_unread.write() += 1>"+1 unread"</button>
                <button on:click=move |_| set_unread.set(0)>"Read all"</button>
                <p class="out">
                    {move || if unread.get() == 0 {
                        view! { <span>"All read"</span> }.into_any()
                    } else if unread.get() == 1 {
                        view! { <span>"1 new message"</span> }.into_any()
                    } else {
                        view! { <strong>{unread.get()} " new messages"</strong> }.into_any()
                    }}
                </p>
            </section>
            <section class="box box-timer">
                <h2>"Ticker"</h2>
                <button on:click=move |_| set_running.update(|r| *r = !*r)>
                    {move || if running.get() { "Stop" } else { "Start" }}
                </button>
                <button on:click=move |_| set_speed.update(|s| *s /= 2)>"Faster"</button>
                <p class="out">{ticks} " ticks"</p>
                <Show when=move || running.get()>
                    <input placeholder="A note, while it runs" aria-label="Note"/>
                </Show>
            </section>
            <section class="box box-list">
                <h2>"Shopping"</h2>
                <label>
                    <input type="checkbox" prop:checked=move || show_done.get()
                        on:change=move |ev| set_show_done.set(event_target_checked(&ev))/>
                    " Show done"
                </label>
                <ul>
                    <For
                        each=move || { TODOS.iter().filter(|t| show_done.get() || !t.done).cloned().collect::<Vec<_>>() }
                        key=|t| t.id
                        children=|t| view! { <li>{t.text}</li> }
                    />
                </ul>
            </section>
            <section class="box box-one">
                <h2>"Log in or sign up"</h2>
                <button on:click=move |_| set_joining.update(|j| *j = !*j)>
                    {move || if joining.get() { "I have an account" } else { "I'm new here" }}
                </button>
                <input placeholder=move || if joining.get() { "Work email" } else { "Your email" } aria-label="Email"/>
            </section>
        </main>
    }
}
