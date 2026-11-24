async fn sign(State(db): State<Db>, Form(e): Form<Entry>) -> Redirect {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    Redirect::to("/")
}

#[tokio::main]
async fn main() {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    let db: Db = Arc::new(Mutex::new(conn));
    let app = Router::new().route("/", get(index)).route("/sign", post(sign)).with_state(db);
    let port = std::env::var("PORT").unwrap_or("3000".into());
    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await.unwrap();
    axum::serve(listener, app).await.unwrap();
