# Leptos vs Quillo, a counter: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 16:03:52 +08 2026 (`date`, as the first build started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0, the `wasm32-unknown-unknown` target; **trunk** 0.22.2 (`cargo install --locked trunk`,
  into the project's .cache/rust-tools, as the user allowed), which fetched wasm-bindgen 0.2.130 and wasm-opt
  (binaryen version_131) itself
- **Leptos:** 0.8.23 (`cargo add leptos --features=csr`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-leptos.mjs` (Leptos's screenshots, from its
build), `measure.mjs` (JavaScript and WebAssembly) and `serve-dist.mjs` (serves `counter/dist` as it is). Builds ran
under `taskpolicy -b` with 2 jobs (`CARGO_BUILD_JOBS=2`), so their times say nothing about Rust's speed and aren't in
the Short.

## The two apps

The counter of `../../64-vs-svelte-counter`: a button that shows `doubled`, and "{count} doubled is {doubled}".

- **Leptos** (`counter/`), set up as Leptos's book does (https://book.leptos.dev/getting_started/index.html):
  `cargo new counter`, `cargo add leptos --features=csr`, and an `index.html` for trunk. `src/main.rs` mounts an `App`
  with `signal(0)`, `doubled` as a closure (`move || count.get() * 2`), and a `view!` with the button and the line.
  For the second build, the book's size advice for a client-rendered app
  (https://book.leptos.dev/deployment/binary_size.html): a `[profile.release]` with `opt-level = 'z'`, `lto = true`
  and `codegen-units = 1` in Cargo.toml, and trunk's `data-wasm-opt="z"` on the `rel="rust"` link in index.html.
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6" (`shots-leptos.mjs`, from the tuned
build; `../shots.mjs`, `quillo run`, port 8122); 320x128 at 3x.

## Builds

```
$ trunk build --release                 # as the book sets it up (build-default.txt)
...
    Finished `release` profile [optimized] target(s) in 3m 46s
$ grep -c '^ *Compiling' build-default.txt
173
$ ls -l dist        # sizes in bytes, and the names
  27864  counter-8892a2f64e5aa18b.js
 209172  counter-9960bb78c8368381_bg.wasm
    731  index.html

$ trunk build --release                 # with the book's size profile and wasm-opt (build.txt)
...
    Finished `release` profile [optimized] target(s) in 2m 56s
INFO downloading wasm-opt version="version_131"
$ ls -l dist        # sizes in bytes, and the names
  24257  counter-4e3076f64d282ec2.js
  70522  counter-f5241a3ef52807c9_bg.wasm
    739  index.html

$ du -sh <scratch>/target73
1.0G	<scratch>/target73
```

## What the browser downloads, until the first click

`measure.mjs` opens the page in a fresh browser (no cache), clicks once, waits for "2 1 doubled is 2", and one more
second; every script, inline `<script>` and WebAssembly module is saved and taken with `gzip -9`. Whole outputs:
`measure-leptos-default.txt`, `measure-leptos.txt`, `measure-quillo.txt`.

```
$ node measure.mjs leptos <out>         # as the book sets it up
  JavaScript: 2 pieces, 28126 B raw, 6096 B gzip -9
  WebAssembly: 1 pieces, 209172 B raw, 52493 B gzip -9
  both: 58.6 KB gzip -9
$ node measure.mjs leptos <out>         # tuned as the book says
  JavaScript: 2 pieces, 24519 B raw, 5638 B gzip -9
  WebAssembly: 1 pieces, 70522 B raw, 29017 B gzip -9
  both: 34.7 KB gzip -9
$ node measure.mjs quillo <out>
  JavaScript: 4 pieces, 137386 B raw, 38992 B gzip -9
  WebAssembly: 0 pieces, 0 B raw, 0 B gzip -9
  both: 39.0 KB gzip -9
```

## Files and lines

`cargo new counter` makes 2 files (Cargo.toml, src/main.rs); you add index.html. Quillo's starter,
`quillo new hello --minimal`, makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c counter/src/main.rs; c counter/index.html
17
7
$ c ../app/main.qwe
11
```

Leptos: 17 + 7 + the 4 lines of the size profile (the `[profile.release]` line and its three settings; `cargo add`
wrote the dependency) = 28. Quillo: 11.
