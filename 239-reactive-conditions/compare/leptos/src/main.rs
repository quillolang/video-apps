use leptos::prelude::*;

fn main() {
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}

#[component]
fn Counter() -> impl IntoView {
    let (n, set_n) = signal(0);
    view! {
        <div class="panel">
            <span class="count">"Clicked " {n}</span>
            <button on:click=move |_| *set_n.write() += 1>"+1"</button>
        </div>
    }
}

#[component]
fn App() -> impl IntoView {
    let (open, set_open) = signal(false);
    let (status, set_status) = signal("loading");
    let (unread, set_unread) = signal(0);
    let (joining, set_joining) = signal(false);
    let (shown, set_shown) = signal(true);
    let label = move || if open.get() { "Hide details" } else { "Show details" };
    view! {
        <main>
            <h1>"Leptos"</h1>
            <section class="box box-details">
                <h2>"Details"</h2>
                <button on:click=move |_| set_open.update(|o| *o = !*o)>{label}</button>
                <Show when=move || open.get()>
                    <p class="out">"Ships in 2 days."</p>
                </Show>
            </section>
            <section class="box box-status">
                <h2>"Status"</h2>
                <button on:click=move |_| set_status.set("loading")>"Loading"</button>
                <button on:click=move |_| set_status.set("error")>"Error"</button>
                <button on:click=move |_| set_status.set("ready")>"Ready"</button>
                <p class="out">
                    {move || match status.get() {
                        "loading" => view! { <em>"Loading…"</em> }.into_any(),
                        "error" => view! { <strong>"Couldn't load"</strong> }.into_any(),
                        _ => view! { <span>"3 messages"</span> }.into_any(),
                    }}
                </p>
            </section>
            <section class="box box-zero">
                <h2>"Unread"</h2>
                <button on:click=move |_| *set_unread.write() += 1>"+1 unread"</button>
                <button on:click=move |_| set_unread.set(0)>"Read all"</button>
                <p class="out">
                    "Inbox"
                    <Show when=move || { unread.get() > 0 }>
                        <span class="badge">{unread} " new"</span>
                    </Show>
                </p>
            </section>
            <section class="box box-switch wide">
                <h2>"Log in or sign up"</h2>
                <button on:click=move |_| set_joining.update(|j| *j = !*j)>
                    {move || if joining.get() { "I have an account" } else { "I'm new here" }}
                </button>
                <Show
                    when=move || joining.get()
                    fallback=|| view! { <input placeholder="Your email" aria-label="Your email"/> }
                >
                    <input placeholder="Work email" aria-label="Work email"/>
                </Show>
            </section>
            <section class="box box-keep">
                <h2>"Counter"</h2>
                <button on:click=move |_| set_shown.update(|s| *s = !*s)>
                    {move || if shown.get() { "Hide counter" } else { "Show counter" }}
                </button>
                <Show when=move || shown.get()>
                    <Counter/>
                </Show>
            </section>
        </main>
    }
}
