# Sycamore vs Quillo, a counter: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 16:26:10 +08 2026 (`date`, as the first build started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0, `wasm32-unknown-unknown`; **trunk** 0.22.2 (in .cache/rust-tools, as for
  `../../73-vs-leptos-counter`), with wasm-bindgen 0.2.130 and wasm-opt (binaryen version_131)
- **Sycamore:** 0.9.4 (`cargo add sycamore@0.9.4`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-sycamore.mjs` (Sycamore's screenshots, from
its tuned build), `measure.mjs` (JavaScript and WebAssembly, as in 73) and `serve-dist.mjs`. Builds ran under
`taskpolicy -b` with 2 jobs, so their times aren't in the Short.

## The two apps

The counter of `../../64-vs-svelte-counter`: a button that shows `doubled`, and "{count} doubled is {doubled}".

- **Sycamore** (`counter/`), set up as Sycamore's guide does (docs/next/introduction/your-first-app.md at 0.9.4):
  `cargo new`, `cargo add sycamore@0.9.4`, and the guide's `index.html`. `src/main.rs` has a `#[component]` with
  `create_signal(0i32)`, `doubled` as a closure, an `increment` closure (as in Sycamore's own counter example), and the
  `view!`. For the second build, the size settings from Sycamore's cookbook (docs/next/cookbook/optimize-wasm-size.md):
  a `[profile.release]` with `panic = 'abort'`, `codegen-units = 1`, `opt-level = 'z'` (the cookbook shows `'s'`,
  "or 'z' to optimize aggressively for size") and `lto = true`, and wasm-opt, by `data-wasm-opt="z"` on a
  `rel="rust"` link in index.html, as the cookbook says.
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6" (`shots-sycamore.mjs`; `../shots.mjs`,
`quillo run`, port 8124); 320x128 at 3x.

## Builds

```
$ trunk build --release                 # as the guide sets it up (build-default.txt)
$ grep -c '^ *Compiling' build-default.txt
34
$ trunk build --release                 # with the cookbook's settings (build.txt)
$ ls -l dist        # sizes in bytes, and the names
  16297  counter-45aa12454098398c.js
  50503  counter-902a5a41969c747c_bg.wasm
    749  index.html
$ du -sh <scratch>/target77
256M	<scratch>/target77
```

## What the browser downloads, until the first click

As in 73: a fresh browser, one click, "2 1 doubled is 2", one more second; every script, inline `<script>` and
WebAssembly module, gzip -9. Whole outputs: `measure-sycamore-default.txt`, `measure-sycamore.txt`,
`measure-quillo.txt`.

```
$ node measure.mjs sycamore <out>       # as the guide sets it up
  JavaScript: 2 pieces, 16559 B raw, 4544 B gzip -9
  WebAssembly: 1 pieces, 114750 B raw, 33120 B gzip -9
  both: 37.7 KB gzip -9
$ node measure.mjs sycamore <out>       # with the cookbook's settings
  JavaScript: 2 pieces, 16559 B raw, 4546 B gzip -9
  WebAssembly: 1 pieces, 50503 B raw, 22327 B gzip -9
  both: 26.9 KB gzip -9
$ node measure.mjs quillo <out>
  JavaScript: 4 pieces, 137386 B raw, 38992 B gzip -9
  both: 39.0 KB gzip -9
```

Sycamore wins both: smaller than Quillo's even as the guide sets it up.

## Files and lines

`cargo new` makes 2 files; you add index.html. Quillo's starter, `quillo new hello --minimal`, makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c counter/src/main.rs; c counter/index.html
14
7
$ c ../app/main.qwe
11
```

Sycamore: 14 + 7 + the 5 lines of the size profile = 26. Quillo: 11.
