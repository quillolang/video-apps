# How the numbers in "Quillo vs 6 Rust Web Frameworks" were measured

One Mac (Apple M5, 10 cores, darwin 25.6.0), Rust 1.99.0, quillo 0.8.10 (61997ab, 2026-11-22). Other work was running on the machine at the same time
(load 18 at the end of the run). `MEASURE.json` is the run the video shows; `runs/build-*.json` and
`runs/build-*.txt` are the builds.

The app is the same in all of them: `GET /` is a page with a form (name, message) and every entry, newest first, from
SQLite (`guestbook.db`, made at start); `POST /sign` saves one and goes back to `/` (Leptos and Dioxus through their
server functions; Yew through its API). What people type is escaped. The Rust servers use rusqlite 0.43 (bundled
SQLite) with one connection behind a `Mutex`, and prepare the query on every request, as most examples do;
`axum-tuned` is Axum with a connection per thread (WAL) and `prepare_cached` (about thirty lines changed).

- **Leptos** and **Dioxus** start from their own starters (`cargo leptos new --git https://github.com/leptos-rs/start-axum`,
  `dx new` with the fullstack Bare-Bones template), the welcome page replaced by the guestbook.
- **Yew** runs only in the browser (built by Trunk); its entries come from a small Axum API in `yew/api`, which also
  serves the built app.

`sh build.sh <side>` fetches the crates first, then times a release build from an empty target folder, and writes
`runs/build-<side>.json`; the six were built one after another. `node measure.mjs` (macOS or Linux: it uses `ps` and
`wrk`) then runs each from a fresh folder:

| | Lines | Files | Clean build | Packages in Cargo.lock | Deployed | Start | Memory idle / under load | Requests/s | Browser downloads | Entries without JS |
|---|---|---|---|---|---|---|---|---|---|---|
| Quillo 0.8.10 | 19 | 1 | none | none | 33.2 MB | 11 ms | 18.3 / 18.4 MB | 47,447 | 1.1 KB (0 KB JS + Wasm) | yes |
| Axum 0.8.9 | 64 | 2 | 22 s | 68 | 3.6 MB | 8 ms | 4.1 / 4.3 MB | 23,645 | 1.1 KB (0 KB JS + Wasm) | yes |
| Axum 0.8.9, tuned | 72 | 2 | 28 s | 68 | 3.6 MB | 9 ms | 4.2 / 4.6 MB | 89,984 | 1.1 KB (0 KB JS + Wasm) | yes |
| Actix Web 4.20.0 | 66 | 2 | 46 s | 165 | 8.2 MB | 8 ms | 6.0 / 6.3 MB | 23,704 | 1.1 KB (0 KB JS + Wasm) | yes |
| Rocket 0.5.4 | 61 | 2 | 42 s | 161 | 6.7 MB | 5 ms | 5.9 / 6.3 MB | 23,051 | 1.1 KB (0 KB JS + Wasm) | yes |
| Leptos 0.8.23 | 183 | 4 | 109 s | 252 | 10.6 MB | 6 ms | 4.6 / 7.8 MB | 27,237 | 530.1 KB (526 KB JS + Wasm) | yes |
| Dioxus 0.7.10 | 83 | 3 | 106 s | 657 | 11.0 MB | 176 ms | 11.2 / 11.5 MB | 20,617 | 2,579.8 KB (2,575 KB JS + Wasm) | yes |
| Yew 0.23 + Axum API | 144 | 5 | 45 s | 94 + 74 | 4.4 MB | 4 ms | 4.3 / 4.6 MB | 33,928 | 338.7 KB (337 KB JS + Wasm) | no |

- Lines: not blank and not a comment, in every file the app keeps (the code, Cargo.toml, Dioxus.toml, index.html; not
  Cargo.lock, assets or the starters' READMEs). Packages: Cargo.lock's, the app's own left out (Yew: its two lock files).
  Quillo's own binary is built from 514 crates; an app needs none.
- Deployed: the server binary and the files it serves; for Quillo, its binary (the same for every app) and main.qwe.
- Start: to the first 200 on `/` (Yew: `/api/entries`), median of 5 fresh starts.
- Requests/s: `wrk -t4 -c64 -d10s` on the page with 20 entries (Yew: `/api/entries`), three rounds with the sides
  taking turns, median. Memory: the most RSS during those rounds.
- Browser: Chromium, until the 20th entry shows; bytes as received, unpacked. "Entries without JS": whether the
  entries are in the page's HTML. With JavaScript off, Leptos shows its Suspense fallback ("Loading…"), as its
  default out-of-order streaming does (`ssr=SsrMode::Async` on the route changes that), and Yew shows a blank page.
