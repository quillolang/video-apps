# Dioxus vs Quillo, a counter: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 16:40:08 +08 2026 (`date`, as the first build started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0, `wasm32-unknown-unknown`; **dioxus-cli** 0.7.10 (`dx`; `cargo install dioxus-cli
  --version 0.7.10 --locked`, into the project's .cache/rust-tools, as the user allowed); **wasm-opt** version_131
- **Dioxus:** 0.7 (`dioxus = "0.7.1"` in the template's Cargo.toml; Cargo.lock has the version cargo picked)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-dioxus.mjs` (Dioxus's screenshots, from its
tuned build), `measure.mjs` (JavaScript and WebAssembly, as in `../../73-vs-leptos-counter`) and `serve-dist.mjs`
(serves `public/`, a copy of dx's output). Builds ran under `taskpolicy -b` with 2 jobs, so their times aren't in the
Short.

## The two apps

The counter of `../../64-vs-svelte-counter`: a button that shows `doubled`, and "{count} doubled is {doubled}".

- **Dioxus** (`counter/`): `dx new counter --subtemplate Bare-Bones -o default_platform=web -o is_fullstack=false
  -o is_router=false -o is_tailwind=false -o is_prompt=false` (the template's defaults, given as options; dx new
  needs a terminal, so it ran under macOS's `script`). dx filled Cargo.toml's `authors` from git config, with a name
  and an email: that line was taken out before anything was published. `src/main.rs` replaced the template's: `App`
  with `use_signal(|| 0)`, `let doubled = count() * 2` (a Dioxus component runs again when a signal it reads changes),
  and the `rsx!`. For the tuned build, the stable size settings of Dioxus's guide
  (https://dioxuslabs.com/learn/0.7/guides/tips/optimizing, "Build configuration", "Stable"), in
  `counter/.cargo/config.toml` as it says (`opt-level = "z"`, `debug = false`, `lto = true`, `codegen-units = 1`,
  `panic = "abort"`, `incremental = false`), then its `wasm-opt ... -Oz` step on the built wasm. The guide's
  nightly-only settings go further; they weren't used.
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6" (`shots-dioxus.mjs`; `../shots.mjs`,
`quillo run`, port 8125); 320x128 at 3x.

## Builds

```
$ dx build --release --platform web     # as dx new sets it up (build-default.txt)
...
118.91s  INFO Compiled [175/175]: counter
119.59s  INFO Installing wasm-opt
123.18s  INFO Client build completed successfully! 🚀
$ ls -l public/assets       # sizes in bytes, and the names
  57387  counter-dxh79e2a3f5a5b79b.js
1963845  counter_bg-dxh53cbbc74dfd9791e.wasm

$ dx build --release --platform web     # with .cargo/config.toml (build.txt)
...
127.08s  INFO Compiled [175/175]: counter
$ wasm-opt public/assets/counter_bg-dxhd5d46227c98c5af8.wasm -o (the same) -Oz
$ ls -l public/assets/counter_bg-dxhd5d46227c98c5af8.wasm
 625030  (713858 before wasm-opt -Oz)
$ du -sh <scratch>/target67
696M	<scratch>/target67
```

## What the browser downloads, until the first click

As in 73: a fresh browser, one click, "2 1 doubled is 2", one more second; every script, inline `<script>` and
WebAssembly module, gzip -9. Whole outputs: `measure-dioxus-default.txt`, `measure-dioxus-profile.txt` (the guide's
settings, before wasm-opt), `measure-dioxus.txt`, `measure-quillo.txt`.

```
$ node measure.mjs dioxus <out>         # as dx new sets it up
  JavaScript: 1 pieces, 57387 B raw, 13670 B gzip -9
  WebAssembly: 1 pieces, 1963845 B raw, 476123 B gzip -9
  both: 489.8 KB gzip -9
$ node measure.mjs dioxus <out>         # the guide's stable settings
  WebAssembly: 1 pieces, 713858 B raw, 250843 B gzip -9
  both: 261.2 KB gzip -9
$ node measure.mjs dioxus <out>         # and wasm-opt -Oz
  JavaScript: 1 pieces, 40201 B raw, 10401 B gzip -9
  WebAssembly: 1 pieces, 625030 B raw, 205906 B gzip -9
  both: 216.3 KB gzip -9
$ node measure.mjs quillo <out>
  JavaScript: 4 pieces, 137386 B raw, 38992 B gzip -9
  both: 39.0 KB gzip -9
```

## Files and lines

`dx new` (Bare-Bones, web) makes 10 files: .gitignore, AGENTS.md, Cargo.toml, Dioxus.toml, README.md,
assets/favicon.ico, assets/header.svg, assets/main.css, clippy.toml, src/main.rs. Quillo's starter,
`quillo new hello --minimal`, makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*\(//\|#\)'; }
$ c counter/src/main.rs; c counter/.cargo/config.toml
15
7
$ c ../app/main.qwe
11
```

Dioxus: 15 + 7 = 22. Quillo: 11.
