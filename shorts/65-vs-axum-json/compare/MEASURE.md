# Axum vs Quillo, the JSON API from Axum's README: the measurements

Every number and answer in the Short (the terminals and the `versus` scene in `../video.json`) comes from a command
below, with what it printed, copied from the run. Measured on one machine; your numbers will vary.

This Short was started on 2026-11-17 by another session (voiceovertext-com-9f: the Quillo app, the Axum project, and a
measure script with a load test); quillo-videos-ae finished it on 2026-11-19. The load test and timings were left
out, and that script removed, since other work on the machine was being measured: no speed numbers here.

- **When:** Thu Nov 19 2026, about 17:25 +08 (the build's `date` is in build.txt)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0. **Axum** 0.8.9, **tokio** 1.54.1 (`full`), **serde** 1.0.229 (`derive`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

## The two apps

- **Axum** (`axum/`): `cargo new users`, the three crates, and `src/main.rs` the example from Axum's README (a router
  with `GET /` and `POST /users`, a `create_user` handler taking `Json<CreateUser>` and answering `201` with a `User`,
  and the two serde structs), laid out to fit the Short's 50 columns (the same code; rustfmt's usual width puts the
  listener and the handler's signature on one line each). Built with `cargo build --release`, in a scratch target
  folder; it listens on 3000.
- **Quillo** (`../app/main.qwe`): two record types, `route GET /` and `route POST /users { json: CreateUser }`, which
  answers `respond(201, User({ id: 1337, ...json }))`. `quillo check` prints
  `main.qwe: ok (2 routes, 0 functions, 0 components)`.

## The calls (calls.sh)

Each server was started, called three ways, and stopped (saved as `calls-axum.txt`, `calls-quillo.txt`):

```
$ ./calls.sh http://localhost:3000            # Axum
## GET /
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Hello, World!

## POST /users {"username": "ada"}
HTTP/1.1 201 Created
content-type: application/json
{"id":1337,"username":"ada"}

## POST /users {"user": "ada"}
HTTP/1.1 422 Unprocessable Entity
content-type: text/plain; charset=utf-8
Failed to deserialize the JSON body into the target type: missing field `username` at line 1 column 15

$ ./calls.sh http://127.0.0.1:8130            # Quillo, quillo run main.qwe --port 8130
## GET /
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
Hello, World!

## POST /users {"username": "ada"}
HTTP/1.1 201 Created
content-type: application/json
{"id":1337,"username":"ada"}

## POST /users {"user": "ada"}
HTTP/1.1 400 Bad Request
content-type: text/plain; charset=utf-8
bad request: no route pattern matches this request
```

With the wrong field, Axum's `Json` extractor says what's missing; Quillo 0.8.6's route pattern doesn't match, and no
route is left, so it answers a bare 400 (a route for anything else can answer with a reason, as
`../../22-typed-route` does).

## Files, crates, size and lines

```
$ cargo new users          # 2 files: Cargo.toml, src/main.rs
$ grep -c '^name = ' axum/Cargo.lock
61
$ cargo build --release    # build.txt
    Finished `release` profile [optimized] target(s) in 52.09s
$ ls -l target/release/users
1817616 bytes
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c axum/src/main.rs; c ../app/main.qwe
39
5
```

Quillo's starter, `quillo new hello --minimal`, makes 4 files; Quillo is the one quillo binary, 30,584,944 bytes, 29M.
(The build shared a target folder with `../../69-vs-axum-db`, which uses the same crates, so it compiled 26 of them.)
