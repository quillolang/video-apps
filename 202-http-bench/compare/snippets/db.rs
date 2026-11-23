// The same page, its fortunes read from SQLite: one connection for each server thread.
#[cfg(feature = "server")]
thread_local! {
    static DB: rusqlite::Connection = rusqlite::Connection::open("fortunes.db").expect("fortunes.db");
}

#[cfg(feature = "server")]
fn db_fortunes() -> rusqlite::Result<Vec<Fortune>> {
    DB.with(|db| {
        let mut q = db.prepare_cached("select id, message from fortune")?;
        let rows = q.query_map([], |r| Ok(Fortune { id: r.get(0)?, message: r.get(1)? }))?;
        rows.collect()
    })
}

#[get("/api/fortunes")]
async fn read_fortunes() -> Result<Vec<Fortune>> {
    Ok(db_fortunes()?)
}

#[component]
fn Db() -> Element {
    let list = use_server_future(read_fortunes)?;
    let list = list().unwrap()?;
    rsx! { Table { list } }
}
