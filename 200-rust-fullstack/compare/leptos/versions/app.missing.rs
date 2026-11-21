// Trail Guide in Leptos: every address renders on the server, then the router changes pages in the browser.
// The trail's two tabs are nested routes under its page, which shows them in an <Outlet/>.
use leptos::prelude::*;
use leptos_meta::{provide_meta_context, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{Outlet, ParentRoute, Route, Router, Routes, A},
    hooks::use_params,
    params::Params,
    path,
};
use serde::{Deserialize, Serialize};

#[derive(Clone, PartialEq, Serialize, Deserialize)]
pub struct Trail { id: u32, name: String, km: f32, climb: u32, level: String, about: String }

#[derive(Clone, PartialEq, Serialize, Deserialize)]
pub struct Review { trail: u32, who: String, stars: u32, text: String }

// ---- the server's side ----------------------------------------------------------------------------------

#[cfg(feature = "ssr")]
fn trails() -> Vec<Trail> {
    serde_json::from_str(include_str!("../data/trails.json")).unwrap()
}

#[cfg(feature = "ssr")]
fn reviews() -> Vec<Review> {
    serde_json::from_str(include_str!("../data/reviews.json")).unwrap()
}

#[server]
pub async fn list_trails() -> Result<Vec<Trail>, ServerFnError> {
    Ok(trails())
}

#[server]
pub async fn load_trail(id: u32) -> Result<Option<Trail>, ServerFnError> {
    Ok(trails().into_iter().find(|t| t.id == id))
}

#[server]
pub async fn load_reviews(id: u32) -> Result<Vec<Review>, ServerFnError> {
    Ok(reviews().into_iter().filter(|r| r.trail == id).collect())
}

// ---- the page and the routes ------------------------------------------------------------------------------

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <AutoReload options=options.clone() />
                <HydrationScripts options/>
                <MetaTags/>
            </head>
            <body>
                <App/>
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();
    // The saved trails, for the header and every Save button, through context.
    let saved = RwSignal::new(Vec::<u32>::new());
    provide_context(saved);

    view! {
        <Stylesheet id="leptos" href="/pkg/trails.css"/>
        <Title text="Trail Guide"/>
        <Router>
            <header>
                <a class="brand" href="/">"Trail Guide"</a>
                <span class="saved">"★ " {move || saved.read().len()} " saved"</span>
            </header>
            <main>
                <Routes fallback=|| view! { <Missing what="No such page"/> }>
                    <Route path=path!("/") view=Home/>
                    <ParentRoute path=path!("/trails/:id") view=TrailPage>
                        <Route path=path!("") view=Overview/>
                        <Route path=path!("reviews") view=Reviews/>
                    </ParentRoute>
                </Routes>
            </main>
        </Router>
    }
}

// ---- components -------------------------------------------------------------------------------------------

#[slot]
pub struct Footer {
    children: ChildrenFn,
}

#[component]
fn Card(title: &'static str, #[prop(optional)] footer: Option<Footer>, children: Children) -> impl IntoView {
    view! {
        <section class="card">
            <h2>{title}</h2>
            {children()}
            {footer.map(|f| view! { <footer>{(f.children)()}</footer> })}
        </section>
    }
}

#[component]
fn Badge(level: String) -> impl IntoView {
    view! { <span class=format!("badge {level}")>{level.clone()}</span> }
}

#[component]
fn TrailItem(trail: Trail) -> impl IntoView {
    view! {
        <li>
            <a href=format!("/trails/{}", trail.id)>{trail.name}</a>
            <Badge/>
            <span class="facts">{trail.km} " km · " {trail.climb} " m climb"</span>
        </li>
    }
}

#[component]
fn Missing(what: &'static str) -> impl IntoView {
    // On the server, the answer's status becomes 404.
    #[cfg(feature = "ssr")]
    if let Some(response) = use_context::<leptos_axum::ResponseOptions>() {
        response.set_status(axum::http::StatusCode::NOT_FOUND);
    }
    view! {
        <Title text=what/>
        <h1 class="missing">"404: " {what}</h1>
        <a href="/">"← All trails"</a>
    }
}

#[component]
fn Home() -> impl IntoView {
    let trails = Resource::new(|| (), |_| list_trails());
    view! {
        <Title text="Trail Guide"/>
        <h1>"Trails"</h1>
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            <ul class="trails">
                {move || Suspend::new(async move {
                    trails.await.map(|list| {
                        list.into_iter().map(|t| view! { <TrailItem trail=t/> }).collect_view()
                    })
                })}
            </ul>
        </Suspense>
    }
}

#[component]
fn SaveButton(id: u32) -> impl IntoView {
    let saved = expect_context::<RwSignal<Vec<u32>>>();
    let on = move || saved.read().contains(&id);
    view! {
        <button
            class=move || if on() { "save on" } else { "save" }
            on:click=move |_| {
                if on() { saved.write().retain(|s| *s != id) } else { saved.write().push(id) }
            }
        >
            {move || if on() { "★ Saved" } else { "☆ Save" }}
        </button>
    }
}

#[derive(Params, PartialEq)]
struct TrailParams {
    id: Option<u32>,
}

/// The trail's id from the address, or None when it isn't a number.
fn trail_id() -> impl Fn() -> Option<u32> + Copy + Send + Sync + 'static {
    let params = use_params::<TrailParams>();
    move || params.read().as_ref().ok().and_then(|p| p.id)
}

type TrailResource = Resource<Result<Option<Trail>, ServerFnError>>;

/// The layout of a trail's pages: its name and tabs, and the tab's page in the Outlet.
#[component]
fn TrailPage() -> impl IntoView {
    let id = trail_id();
    let trail: TrailResource = Resource::new(id, |id| async move {
        match id { Some(id) => load_trail(id).await, None => Ok(None) }
    });
    provide_context(trail);   // the tabs below read the same trail
    view! {
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            {move || Suspend::new(async move {
                match trail.await {
                    Ok(Some(t)) => view! {
                        <Title text=format!("{} · Trail Guide", t.name)/>
                        <h1>{t.name.clone()} " " <Badge level=t.level.clone()/></h1>
                        <nav class="tabs">
                            <A href=format!("/trails/{}", t.id) exact=true>"Overview"</A>
                            <A href=format!("/trails/{}/reviews", t.id)>"Reviews"</A>
                            <SaveButton id=t.id/>
                        </nav>
                        <Outlet/>
                    }.into_any(),
                    _ => view! { <Missing what="No such trail"/> }.into_any(),
                }
            })}
        </Suspense>
    }
}

#[component]
fn Overview() -> impl IntoView {
    let trail = expect_context::<TrailResource>();
    view! {
        <Suspense fallback=|| ()>
            {move || Suspend::new(async move {
                trail.await.map(|t| t.map(|t| view! {
                    <Card title="Overview">
                        <Footer slot>"Kept by the trail club"</Footer>
                        <p>{t.about}</p>
                    </Card>
                }))
            })}
        </Suspense>
    }
}

#[component]
fn Reviews() -> impl IntoView {
    let id = trail_id();
    let list = Resource::new(id, |id| load_reviews(id.unwrap_or_default()));
    view! {
        <Suspense fallback=|| view! { <p class="muted">"Loading…"</p> }>
            {move || Suspend::new(async move {
                list.await.map(|list| {
                    let n = list.len();
                    view! {
                        <Card title="Reviews">
                            <Footer slot>{n} " reviews"</Footer>
                            <ul class="reviews">
                                {list.into_iter().map(|r| view! {
                                    <li>
                                        <b>{r.who}</b> " "
                                        <span class="stars">{"★".repeat(r.stars as usize)}</span>
                                        <p>{r.text}</p>
                                    </li>
                                }).collect_view()}
                            </ul>
                        </Card>
                    }
                })
            })}
        </Suspense>
    }
}
