#[post("/sign")]
async fn sign(db: Db, e: web::Form<Entry>) -> HttpResponse {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    HttpResponse::SeeOther().insert_header((header::LOCATION, "/")).finish()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    let db = web::Data::new(Mutex::new(conn));
    let port: u16 = std::env::var("PORT").unwrap_or("3000".into()).parse().unwrap();
    HttpServer::new(move || App::new().app_data(db.clone()).service(index).service(sign))
        .bind(("127.0.0.1", port))?
        .run()
        .await
