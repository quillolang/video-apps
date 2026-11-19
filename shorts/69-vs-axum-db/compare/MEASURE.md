# A JSON API from a table, Axum + sqlx vs Quillo: the measurements

Every number and answer in the Short (the terminals and the `versus` scene in `../video.json`) comes from a
command below, with what it printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 14:18:18 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** `cargo 1.99.0 (5f94df478 2026-08-27)`, `rustc 1.99.0 (b940084d7 2026-09-28)`, rustfmt 1.10.0
- **Crates:** axum 0.8.9, tokio 1.54.1 (`full`), serde 1.0.229 (`derive`), sqlx 0.9.1 (`sqlite`, `runtime-tokio`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

The script that measured is in this folder: `calls.sh` (two calls, with the table dropped in between). The build
ran under `taskpolicy -b` with `-j 2`, to leave the machine to other work, so its time (7 m 10 s) says nothing
about Rust's compile speed and isn't in the Short.

## The two apps

The trails in a SQLite table (three, from the migration, the same SQL on both sides), as JSON at
`GET /api/trails`.

- **Axum** (`trails/`): `cargo new trails`, then `cargo add axum tokio --features tokio/full serde --features
  serde/derive sqlx --features sqlx/sqlite,sqlx/runtime-tokio`. `src/main.rs` has a `Trail` struct
  (`Serialize`, `sqlx::FromRow`), a `SqlitePool` (with `?mode=rwc`, so the file is made when it isn't there),
  `sqlx::migrate!()` for `migrations/001_trails.sql`, a router with the pool as state, and a handler written as
  axum's own sqlx example writes its handlers (https://github.com/tokio-rs/axum/tree/main/examples/sqlx-postgres):
  `Result<_, (StatusCode, String)>`, with `.map_err(internal_error)`, and `internal_error` as the example has it.
  Its lines are broken to fit the Short's 50 columns.
- **Quillo** (`../app/`): `main.qwe` opens the database, runs `migrations/001_trails.sql`, and has
  `route GET /api/trails with db = db.query(...)`; a list a route gives is sent as JSON. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 0 components)`.

## The calls

Each server started from no `trails.db` (so its migration made the table), then `calls.sh` called it, dropped
the table with the `sqlite3` command, and called it again (saved as `calls-axum.txt`, `calls-quillo.txt`).

```
$ ./target/release/trails                  # in trails/, CARGO_TARGET_DIR in a scratch folder
$ ./calls.sh http://127.0.0.1:3000 trails/trails.db
## GET /api/trails
HTTP/1.1 200 OK
content-type: application/json
[{"id":1,"name":"Coastal Path","km":12.5},{"id":2,"name":"Fern Gully","km":4.2},{"id":3,"name":"Ridge Loop","km":8.0}]

## the table dropped, GET /api/trails again
HTTP/1.1 500 Internal Server Error
content-type: text/plain; charset=utf-8
error returned from database: (code: 1) no such table: trails

$ quillo run main.qwe --port 8119          # in ../app
$ ./calls.sh http://127.0.0.1:8119 ../app/trails.db
## GET /api/trails
HTTP/1.1 200 OK
content-type: application/json
[{"id":1,"name":"Coastal Path","km":12.5},{"id":2,"name":"Fern Gully","km":4.2},{"id":3,"name":"Ridge Loop","km":8.0}]

## the table dropped, GET /api/trails again
HTTP/1.1 500 Internal Server Error
content-type: application/json
{"error":"internal error"}
```

The JSON is the same, byte for byte. With the table gone, Axum's handler sends sqlx's error text to the client, as
`internal_error` does in axum's example (a handler can of course log it and send less); Quillo sends
`{"error":"internal error"}` and writes the details in its log, with the request id:

```
GET /api/trails -> 200 (0.0ms)
quillo: error: GET /api/trails (rid 89cbb0322509b3bc): main.qwe:7: db: no such table: trails
GET /api/trails -> 500 (0.5ms)
```

## Files, crates, size and lines

```
$ cargo new trails --vcs none
    Creating binary (application) `trails` package
$ find trails -type f | sort
trails/Cargo.toml
trails/src/main.rs

$ cargo build --release -j 2               # whole output in build.txt
...
    Finished `release` profile [optimized] target(s) in 7m 10s
$ grep -c '^ *Compiling' build.txt
133
$ ls -l target/release/trails
-rwxr-xr-x@ 1 you  wheel  5065696 Nov 19 14:26 target/release/trails
$ du -sh target
471M	target

$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c trails/src/main.rs                     # as it is, at 50 columns
54
$ rustfmt --edition 2024 main.rs && c main.rs   # a copy, laid out by rustfmt's defaults
36
$ c trails/migrations/001_trails.sql; c ../app/main.qwe; c ../app/migrations/001_trails.sql
9
4
9
```

- Files the starter makes: 2 (`cargo new`); Quillo's, `quillo new hello --minimal`, makes 4. Cargo wins.
- What you add: 4 crates, which bring 133 crates to compile (`Compiling` lines, the app's own included) and a
  471 MB target folder. Quillo: the one quillo binary, 30,584,944 bytes, 29M.
- Lines you write: Axum 36 (rustfmt's layout, the fairer count; 54 as the Short shows it) + 9 = 45; Quillo
  4 + 9 = 13.
- What you ship: Axum's release binary, 5,065,696 bytes, 5.1 MB, with the migrations built in; Quillo's app is
  main.qwe and its migration, run by the 29 MB quillo binary. Axum wins.
