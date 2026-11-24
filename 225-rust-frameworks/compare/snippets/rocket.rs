#[post("/sign", data = "<e>")]
fn sign(db: &State<Db>, e: Form<Entry>) -> Redirect {
    let db = db.lock().unwrap();
    db.execute("insert into entries (name, message) values (?1, ?2)", (&e.name, &e.message)).unwrap();
    Redirect::to(uri!(index))
}

#[launch]
fn rocket() -> _ {
    let conn = Connection::open("guestbook.db").unwrap();
    conn.execute(
        "create table if not exists entries (id integer primary key, name text not null, message text not null)",
        (),
    )
    .unwrap();
    rocket::build().manage(Mutex::new(conn)).mount("/", routes![index, sign])
