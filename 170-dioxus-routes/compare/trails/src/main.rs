// Trail Guide: a page for each trail, at /trails/<its number>. The routes are one enum: /trails/:id takes the
// number as a u32, and a path that matches nothing else is NotFound.
use dioxus::prelude::*;

struct Trail {
    name: &'static str,
    km: f32,
    climb: u32,
    level: &'static str,
}

const TRAILS: [Trail; 6] = [
    Trail { name: "Fern Gully Loop", km: 4.2, climb: 120, level: "easy" },
    Trail { name: "Eagle Ridge", km: 9.8, climb: 640, level: "hard" },
    Trail { name: "Lantern Lake", km: 6.5, climb: 210, level: "easy" },
    Trail { name: "Old Mill Path", km: 3.1, climb: 60, level: "easy" },
    Trail { name: "Granite Steps", km: 7.4, climb: 520, level: "hard" },
    Trail { name: "Cedar Hollow", km: 5.6, climb: 300, level: "medium" },
];

#[derive(Routable, Clone, PartialEq)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/trails/:id")]
    TrailPage { id: u32 },
    #[route("/:..segments")]
    NotFound { segments: Vec<String> },
}

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        document::Stylesheet { href: asset!("/assets/trails.css") }
        Router::<Route> {}
    }
}

#[component]
fn Home() -> Element {
    rsx! {
        document::Title { "Trail Guide" }
        main {
            h1 { "Trail Guide" }
            ul {
                for (i, t) in TRAILS.iter().enumerate() {
                    li { Link { to: Route::TrailPage { id: i as u32 + 1 }, "{t.name}" } }
                }
            }
        }
    }
}

#[component]
fn TrailPage(id: u32) -> Element {
    let Some(t) = (id as usize).checked_sub(1).and_then(|i| TRAILS.get(i)) else {
        return rsx! { Missing { what: "No such trail" } };
    };
    rsx! {
        document::Title { "{t.name}" }
        main {
            Link { to: Route::Home {}, "← All trails" }
            h1 { "{t.name}" }
            p { class: "facts", "{t.km} km · {t.climb} m climb · {t.level}" }
        }
    }
}

#[component]
fn NotFound(segments: Vec<String>) -> Element {
    let _ = segments;
    rsx! { Missing { what: "No such page" } }
}

#[component]
fn Missing(what: &'static str) -> Element {
    rsx! {
        document::Title { "{what}" }
        main {
            Link { to: Route::Home {}, "← All trails" }
            h1 { class: "missing", "404: {what}" }
        }
    }
}
