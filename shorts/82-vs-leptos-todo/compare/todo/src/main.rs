use leptos::prelude::*;

fn main() {
    leptos::mount::mount_to_body(App)
}

#[derive(Clone)]
struct Todo {
    id: usize,
    text: String,
}

fn todo(id: usize, text: &str) -> Todo {
    Todo { id, text: text.to_string() }
}

#[component]
fn App() -> impl IntoView {
    let (next, set_next) = signal(3);
    let (text, set_text) = signal(String::new());
    let (todos, set_todos) = signal(vec![
        todo(0, "Learn HTML"),
        todo(1, "Learn JavaScript"),
        todo(2, "Learn Leptos"),
    ]);
    let add = move |e: leptos::ev::SubmitEvent| {
        e.prevent_default();
        let t = todo(next.get(), &text.get());
        set_todos.write().push(t);
        *set_next.write() += 1;
        set_text.set(String::new());
    };
    let del = move |id: usize| {
        set_todos.write().retain(|t| t.id != id);
    };
    let item = move |t: Todo| view! {
        <li>
            {t.text}
            <button on:click=move |_| del(t.id)>
                "X"
            </button>
        </li>
    };

    view! {
        <form on:submit=add>
            <input bind:value=(text, set_text)
                required placeholder="new todo"/>
            <button>"Add Todo"</button>
        </form>
        <ul>
            <For
                each=move || todos.get()
                key=|t| t.id
                children=item
            />
        </ul>
    }
}
