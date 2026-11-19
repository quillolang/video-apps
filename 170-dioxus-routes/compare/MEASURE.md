# Typed routes, Dioxus and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `routes.mjs` tries each side in a real
browser; its tables are `routes-<side>.txt`, and what each address got is in `../assets/routes-<side>.json`. Measured
on one machine.

- **When:** Thu Nov 19 2026, 20:57 +08 (the build, `build.txt`), the runs and screenshots at about 21:02
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** rustc 1.99.0; **dioxus-cli** 0.7.10 (`dx`, in the project's .cache/rust-tools); **Dioxus** 0.7.10 and
  **dioxus-router** 0.7.10 (Cargo.lock)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The two guides

The Trail Guide of videos 128, 143, 145, 146, 147 and 162: six trails, a page for each at `/trails/<its number>`.

- **Dioxus** (`trails/`): a copy of the project of `shorts/67-vs-dioxus-counter` and `80` (`dx new`, Bare-Bones, web,
  with the `authors` line taken out, and the guide's size settings in `.cargo/config.toml`), named `trails`, with
  `features = ["router"]` and `src/main.rs` replaced: the six trails as a `const`, a `Route` enum that derives
  `Routable` (`#[route("/")] Home {}`, `#[route("/trails/:id")] TrailPage { id: u32 }`,
  `#[route("/:..segments")] NotFound { segments: Vec<String> }`), `Link { to: Route::TrailPage { id } }` for the
  list, and the trail's page or `404: No such trail`, `404: No such page` (the same text as Quillo's pages, with
  `assets/trails.css`, Quillo's style sheet). Built with `dx build --release --platform web` (2 jobs, background
  priority; 224 crates), its `public` folder copied to `dist/` (`index.html`, the JavaScript, the wasm, the CSS).
- **Quillo** (`../app/main.qwe`, video 147's): `route GET /trails/:id(int)`, a 404 for a missing trail, and
  `route GET /*rest`. `quillo check`: `main.qwe: ok (3 routes, 2 functions, 0 components)`.

## Eight addresses (routes.mjs)

The status is from a plain `fetch` of the address; "shows" is the page's `h1` in Chromium once it's drawn (for Dioxus,
after its wasm loads). The `dioxus` side serves `dist/` with the fallback a client-side app needs (a file if there is
one, else `index.html`, always 200), as `dx serve` does; `plain` is `python3 -m http.server` on the same folder.

```
$ node routes.mjs dioxus out.json
dioxus
  /trails/2            200  Eagle Ridge
  /trails/02           200  Eagle Ridge
  /trails/+2           200  Eagle Ridge
  /trails/abc          200  404: No such page
  /trails/999          200  404: No such trail
  /trails/0            200  404: No such trail
  /trails/4294967296   200  404: No such page
  /nowhere             200  404: No such page
$ node routes.mjs plain out.json
plain
  open /               200  Trail Guide   (at /)
  click Eagle Ridge         Eagle Ridge   (at /trails/2)
  reload               404  Error response   (at /trails/2)
$ node routes.mjs quillo out.json
quillo
  /trails/2            200  Eagle Ridge
  /trails/02           404  404: No such page
  /trails/+2           404  404: No such page
  /trails/abc          404  404: No such page
  /trails/999          404  404: No such trail
  /trails/0            404  404: No such trail
  /trails/4294967296   404  404: No such trail
  /nowhere             404  404: No such page
```

Rust's `u32` (its `FromStr`) reads `02` and `+2` as 2; `4294967296` is one more than a u32 holds, so `/trails/:id`
doesn't match and `NotFound` does. Quillo's `int` pattern takes no leading zero or sign; 4294967296 is an int to it,
and there's no such trail.

## A typo in a link

Dioxus, with `Route::Trail` for `Route::TrailPage` in the list's link (`typo-dioxus/main.rs`, put in place of
`src/main.rs` for one build, and the file put back after):

```
$ dx build --release --platform web   (typo-dioxus/main.rs as src/main.rs)
error[E0599]: no variant named `Trail` found for enum `Route`
  --> src/main.rs:51:44
   |
22 | enum Route {
   | ---------- variant `Trail` not found here
...
51 |                     li { Link { to: Route::Trail { id: i as u32 + 1 }, "{t.name}" } }
   |                                            ^^^^^ variant not found in `Route`


  7.30s  INFO  For more information about this error, try `rustc --explain E0599`.

  7.33s  WARN error: could not compile `trails` (bin "trails") due to 1 previous error 

ERROR dx build: cargo build finished with errors for target: trails [wasm32-unknown-unknown]
```

(Between the error and dx's last line are its log lines, with times: they're in the full run, not in the video.)

Quillo, with `/trail/` for `/trails/` in the list's link (`typo-quillo/main.qwe`, on port 8153):

```
$ quillo check main.qwe
main.qwe: ok (3 routes, 2 functions, 0 components)
$ curl -s localhost:8153/ | grep -o "href=\"/trail[^\"]*\"" | head -2
href="/trail/1"
href="/trail/2"
$ curl -s -o /dev/null -w "%{http_code}\n" localhost:8153/trail/2
404
```

## The screenshots (../shots.mjs)

`dx_trail` and `q_trail` (`/trails/2`), `dx_02` and `q_02` (`/trails/02`), and `plain_404` (the build on
`python3 -m http.server`: `/`, Eagle Ridge clicked, then the page reloaded).

## Not measured

No speed numbers: other work was running on the machine (everything here ran at background priority). Dioxus's
fullstack mode, which renders on the server, wasn't tried.
