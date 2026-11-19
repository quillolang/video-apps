use yew::prelude::*;

#[component]
fn App() -> Html {
    let count = use_state(|| 0);
    let doubled = *count * 2;
    let onclick = {
        let count = count.clone();
        move |_| count.set(*count + 1)
    };

    html! {
        <div>
            <button {onclick}>{ doubled }</button>
            <p>
                { *count }
                { " doubled is " }
                { doubled }
            </p>
        </div>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
