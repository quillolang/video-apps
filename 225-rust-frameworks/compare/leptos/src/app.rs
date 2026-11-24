// The guestbook in Leptos: a form, and every entry, newest first, kept in SQLite.
use leptos::prelude::*;
use leptos_meta::{provide_meta_context, MetaTags, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    StaticSegment,
};

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

#[cfg(feature = "ssr")]
mod db {
    use rusqlite::Connection;
    use std::sync::{LazyLock, Mutex};

    pub static DB: LazyLock<Mutex<Connection>> = LazyLock::new(|| {
        let conn = Connection::open("guestbook.db").unwrap();
        conn.execute(
            "create table if not exists entries (id integer primary key, name text not null, message text not null)",
            (),
        )
        .unwrap();
        Mutex::new(conn)
    });
}

#[server]
pub async fn entries() -> Result<Vec<(String, String)>, ServerFnError> {
    let db = db::DB.lock().unwrap();
    let mut stmt = db
        .prepare("select name, message from entries order by id desc")
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    let rows = stmt
        .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))
        .and_then(|rows| rows.collect::<Result<Vec<_>, _>>())
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    Ok(rows)
}

#[server]
pub async fn sign(name: String, message: String) -> Result<(), ServerFnError> {
    let db = db::DB.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&name, &message))
        .map_err(|e| ServerFnError::new(e.to_string()))?;
    Ok(())
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Title text="Guestbook"/>
        <Router>
            <main>
                <Routes fallback=|| "Page not found.".into_view()>
                    <Route path=StaticSegment("") view=HomePage/>
                </Routes>
            </main>
        </Router>
    }
}

#[component]
fn HomePage() -> impl IntoView {
    let sign = ServerAction::<Sign>::new();
    let entries = Resource::new(move || sign.version().get(), |_| entries());

    view! {
        <h1>"Guestbook"</h1>
        <ActionForm action=sign>
            <input name="name" placeholder="Your name" required/>
            <input name="message" placeholder="Say hello" required/>
            <button>"Sign"</button>
        </ActionForm>
        <Suspense fallback=|| view! { <p>"Loading…"</p> }>
            <ul>
                {move || entries.get().map(|rows| {
                    rows.unwrap_or_default()
                        .into_iter()
                        .map(|(name, message)| view! { <li><b>{name}</b>": "{message}</li> })
                        .collect_view()
                })}
            </ul>
        </Suspense>
    }
}
