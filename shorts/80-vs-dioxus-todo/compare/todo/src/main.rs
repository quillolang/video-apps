use dioxus::prelude::*;

fn main() {
    dioxus::launch(App);
}

#[derive(Clone, PartialEq)]
struct Todo {
    id: usize,
    text: String,
}

fn todo(id: usize, text: &str) -> Todo {
    Todo { id, text: text.to_string() }
}

#[component]
fn App() -> Element {
    let mut next = use_signal(|| 3);
    let mut draft = use_signal(String::new);
    let mut todos = use_signal(|| vec![
        todo(0, "Learn HTML"),
        todo(1, "Learn JavaScript"),
        todo(2, "Learn Dioxus"),
    ]);
    let add = move |e: FormEvent| {
        e.prevent_default();
        let t = todo(next(), &draft());
        todos.write().push(t);
        next += 1;
        draft.set(String::new());
    };
    let mut remove = move |id: usize| {
        todos.write().retain(|t| t.id != id);
    };

    rsx! {
        form { onsubmit: add,
            input {
                value: "{draft}",
                required: true,
                placeholder: "new todo",
                oninput: move |e| {
                    draft.set(e.value())
                },
            }
            button { "Add Todo" }
        }
        ul {
            for t in todos() {
                li { key: "{t.id}",
                    "{t.text}"
                    button {
                        onclick: move |_| {
                            remove(t.id)
                        },
                        "X"
                    }
                }
            }
        }
    }
}
