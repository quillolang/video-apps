// Trail Guide in Dioxus fullstack: every address renders on the server, then the router changes pages in the
// browser. The routes are one enum; the trail's two tabs are nested under its layout.
use dioxus::fullstack::{FullstackContext, StatusCode};
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }

#[derive(Clone, PartialEq, Serialize, Deserialize)]
struct Review { trail: u32, who: String, stars: u32, text: String }

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[layout(Layout)]
        #[route("/")]
        Home {},
        #[nest("/trails/:id")]
            #[layout(TrailPage)]
                #[route("/")]
                Overview { id: u32 },
                #[route("/reviews")]
                Reviews { id: u32 },
            #[end_layout]
        #[end_nest]
        #[route("/:..segments")]
        NotFound { segments: Vec<String> },
}

const FAVICON: Asset = asset!("/assets/favicon.ico");
const TRAILS_CSS: Asset = asset!("/assets/trails.css");

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: TRAILS_CSS }
        Router::<Route> {}
    }
}

// ---- the server's side ----------------------------------------------------------------------------------

#[cfg(feature = "server")]
fn trails() -> Vec<Trail> {
    serde_json::from_str(include_str!("../data/trails.json")).unwrap()
}

#[cfg(feature = "server")]
fn reviews() -> Vec<Review> {
    serde_json::from_str(include_str!("../data/reviews.json")).unwrap()
}

#[get("/api/trails")]
async fn list_trails() -> Result<Vec<Trail>, ServerFnError> {
    Ok(trails())
}

#[post("/api/trail")]
async fn load_trail(id: u32) -> Result<Option<Trail>, ServerFnError> {
    Ok(trails().into_iter().find(|t| t.id == id))
}

#[post("/api/reviews")]
async fn load_reviews(id: u32) -> Result<Vec<Review>, ServerFnError> {
    Ok(reviews().into_iter().filter(|r| r.trail == id).collect())
}

// ---- components -------------------------------------------------------------------------------------------

/// The header on every page, and the saved trails, shared through context. The page goes in the Outlet.
#[component]
fn Layout() -> Element {
    let saved = use_context_provider(|| Signal::new(Vec::<u32>::new()));
    rsx! {
        header {
            Link { class: "brand", to: Route::Home {}, "Trail Guide" }
            span { class: "saved", "★ {saved.read().len()} saved" }
        }
        main {
            SuspenseBoundary {
                fallback: |_| rsx! { p { class: "muted", "Loading…" } },
                Outlet::<Route> {}
            }
        }
    }
}

#[component]
fn Card(title: String, footer: Option<Element>, children: Element) -> Element {
    rsx! {
        section { class: "card",
            h2 { "{title}" }
            {children}
            if let Some(f) = footer {
                footer { {f} }
            }
        }
    }
}

#[component]
fn Badge(level: String) -> Element {
    rsx! { span { class: "badge {level}", "{level}" } }
}

#[component]
fn TrailItem(trail: Trail) -> Element {
    rsx! {
        li {
            Link { to: Route::Overview { id: trail.id }, "{trail.name}" }
            Badge { level: trail.level.clone() }
            span { class: "facts", "{trail.km} km · {trail.climb} m climb" }
        }
    }
}

#[component]
fn Missing(what: String) -> Element {
    // On the server, the answer's status becomes 404.
    FullstackContext::commit_http_status(StatusCode::NOT_FOUND, None);
    rsx! {
        document::Title { "{what}" }
        h1 { class: "missing", "404: {what}" }
        Link { to: Route::Home {}, "← All trails" }
    }
}

#[component]
fn Home() -> Element {
    let trails = use_server_future(list_trails)?;
    let trails = trails().unwrap()?;
    rsx! {
        document::Title { "Trail Guide" }
        h1 { "Trails" }
        ul { class: "trails",
            for t in trails {
                TrailItem { key: "{t.id}", trail: t }
            }
        }
    }
}

#[component]
fn SaveButton(id: u32) -> Element {
    let mut saved = use_context::<Signal<Vec<u32>>>();
    let on = saved.read().contains(&id);
    rsx! {
        button {
            class: if on { "save on" } else { "save" },
            onclick: move |_| {
                if on { saved.write().retain(|s| *s != id) } else { saved.write().push(id) }
            },
            if on { "★ Saved" } else { "☆ Save" }
        }
    }
}

type TrailResource = Resource<Result<Option<Trail>, ServerFnError>>;

/// The layout of a trail's pages: its name and tabs, and the tab's page in the Outlet.
#[component]
fn TrailPage(id: ReadSignal<u32>) -> Element {
    let trail: TrailResource = use_server_future(move || load_trail(id()))?;
    use_context_provider(|| trail);   // the tabs below read the same trail
    let Some(trail) = trail().unwrap()? else {
        return rsx! { Missing { what: "No such trail" } };
    };
    let id = id();
    rsx! {
        document::Title { "{trail.name} · Trail Guide" }
        h1 { "{trail.name} " Badge { level: trail.level.clone() } }
        nav { class: "tabs",
            Link { to: Route::Overview { id }, active_class: "active", "Overview" }
            Link { to: Route::Reviews { id }, active_class: "active", "Reviews" }
            SaveButton { id }
        }
        Outlet::<Route> {}
    }
}

#[component]
fn Overview(id: ReadSignal<u32>) -> Element {
    let _ = id;
    let trail = use_context::<TrailResource>();
    let Some(Ok(Some(trail))) = trail() else { return rsx! {} };
    rsx! {
        Card { title: "Overview", footer: rsx! { span { "Kept by the trail club" } },
            p { "{trail.about}" }
        }
    }
}

#[component]
fn Reviews(id: ReadSignal<u32>) -> Element {
    let list = use_server_future(move || load_reviews(id()))?;
    let list = list().unwrap()?;
    rsx! {
        Card { title: "Reviews", footer: rsx! { span { "{list.len()} reviews" } },
            ul { class: "reviews",
                for r in list {
                    li { key: "{r.who}",
                        b { "{r.who}" }
                        " "
                        span { class: "stars", {"★".repeat(r.stars as usize)} }
                        p { "{r.text}" }
                    }
                }
            }
        }
    }
}

#[component]
fn NotFound(segments: Vec<String>) -> Element {
    let _ = segments;
    rsx! { Missing { what: "No such page" } }
}
