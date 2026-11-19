# Yew vs Quillo, a counter: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 16:22:15 +08 2026 (`date`, as the first build started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0, `wasm32-unknown-unknown`; **trunk** 0.22.2 (in .cache/rust-tools, as for
  `../../73-vs-leptos-counter`), with wasm-bindgen 0.2.130 and wasm-opt (binaryen version_131), which trunk fetched
- **Yew:** 0.23.0 (`cargo add yew --features csr`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-yew.mjs` (Yew's screenshots, from its tuned
build), `measure.mjs` (JavaScript and WebAssembly, as in 73) and `serve-dist.mjs`. Builds ran under `taskpolicy -b`
with 2 jobs, so their times aren't in the Short.

## The two apps

The counter of `../../64-vs-svelte-counter`: a button that shows `doubled`, and "{count} doubled is {doubled}".

- **Yew** (`counter/`), set up as Yew's docs do (https://yew.rs/docs/getting-started/build-a-sample-app): `cargo new`,
  `cargo add yew --features csr`, and the docs' `index.html`. `src/main.rs` has a `#[component]` with `use_state(|| 0)`,
  `let doubled = *count * 2` (a Yew component runs again when its state changes), an `onclick` with a clone of the
  state handle, and the `html!`. For the second build, the size settings from Yew's docs
  (https://yew.rs/docs/advanced-topics/optimizations, "Reducing binary sizes"): a `[profile.release]` with
  `panic = 'abort'`, `codegen-units = 1`, `opt-level = 'z'` and `lto = true`, and wasm-opt, by trunk's
  `data-wasm-opt="z"` on a `rel="rust"` link in index.html.
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6" (`shots-yew.mjs`; `../shots.mjs`,
`quillo run`, port 8123); 320x128 at 3x.

## Builds

```
$ trunk build --release                 # as the docs set it up (build-default.txt)
...
    Finished `release` profile [optimized] target(s) in 1m 29s
$ grep -c '^ *Compiling' build-default.txt
85
$ trunk build --release                 # with the size settings (build.txt)
...
$ ls -l dist        # sizes in bytes, and the names
 122588  counter-dfa03a6d280b444c_bg.wasm
  27774  counter-f76d2a4a6ceb3e87.js
    813  index.html
$ du -sh <scratch>/target75
490M	<scratch>/target75
```

## What the browser downloads, until the first click

As in 73: a fresh browser, one click, "2 1 doubled is 2", one more second; every script, inline `<script>` and
WebAssembly module, gzip -9. Whole outputs: `measure-yew-default.txt`, `measure-yew.txt`, `measure-quillo.txt`.

```
$ node measure.mjs yew <out>            # as the docs set it up
  JavaScript: 2 pieces, 28881 B raw, 6247 B gzip -9
  WebAssembly: 1 pieces, 340801 B raw, 93486 B gzip -9
  both: 99.7 KB gzip -9
$ node measure.mjs yew <out>            # with the size settings
  JavaScript: 2 pieces, 28036 B raw, 6185 B gzip -9
  WebAssembly: 1 pieces, 122588 B raw, 52339 B gzip -9
  both: 58.5 KB gzip -9
$ node measure.mjs quillo <out>
  JavaScript: 4 pieces, 137386 B raw, 38992 B gzip -9
  both: 39.0 KB gzip -9
```

## Files and lines

`cargo new` makes 2 files; you add index.html. Quillo's starter, `quillo new hello --minimal`, makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c counter/src/main.rs; c counter/index.html
23
9
$ c ../app/main.qwe
11
```

Yew: 23 + 9 + the 5 lines of the size profile (`[profile.release]` and its four settings) = 37. Quillo: 11.
