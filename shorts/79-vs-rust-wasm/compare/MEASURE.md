# What a Rust counter downloads: the measurements

Every number in the Short (the terminal in `../video.json`) comes from `downloads.mjs`; its whole output is
`downloads.txt`, copied here. Measured on one machine, on one day; your numbers will vary.

- **When:** Thu Nov 19 16:53:20 +08 2026 (`date`, as the run started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0, `wasm32-unknown-unknown`; trunk 0.22.2 and dioxus-cli 0.7.10 (in the project's
  .cache/rust-tools, as the user allowed); wasm-bindgen 0.2.130; wasm-opt version_131
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. Builds ran under `taskpolicy -b` with 2 jobs; bytes don't depend on that.

## The counters

The counter of `../../64-vs-svelte-counter` (a button that shows `doubled`, and "{count} doubled is {doubled}"), as
each Rust front end's own Short made it, tuned for size as that framework's docs say; each Short's MEASURE.md has
the details and the untuned numbers.

| App | Project | Build | Its size settings |
|---|---|---|---|
| Sycamore 0.9.4 | `../../77-vs-sycamore-counter/compare/counter` | `trunk build --release` | its cookbook: `opt-level = 'z'`, LTO, one codegen unit, panic abort, wasm-opt z |
| Leptos 0.8.23 | `../../73-vs-leptos-counter/compare/counter` | `trunk build --release` | its book: `opt-level = 'z'`, LTO, one codegen unit, wasm-opt z |
| Yew 0.23.0 | `../../75-vs-yew-counter/compare/counter` | `trunk build --release` | its docs: `opt-level = 'z'`, LTO, one codegen unit, panic abort, wasm-opt z |
| Dioxus 0.7.10 | `../../67-vs-dioxus-counter/compare/counter` | `dx build --release --platform web` | its guide's stable settings in .cargo/config.toml, then `wasm-opt -Oz` |
| Quillo 0.8.6 | `../app` | none | none |

## How it's measured

`downloads.mjs` builds each Rust counter (in its Short's build folder, `CARGO_TARGET_BASE`), copies the built site to
the out folder and serves it as it is (`serve-dist.mjs`); Quillo is `quillo run main.qwe`. One app at a time, a fresh
browser opens the page, waits a second, clicks once, checks for "2 1 doubled is 2", and waits one more second. Every
script, inline `<script>` and WebAssembly module is saved and taken with `gzip -9 -c FILE | wc -c`.

```
$ PATH=<.cache/rust-tools/bin>:<wasm-opt>:$PATH CARGO_TARGET_BASE=<scratch> node downloads.mjs out
sycamore   26.9 KB  (JS 4.5 + wasm 22.3)
leptos     34.6 KB  (JS 5.6 + wasm 29.0)
quillo     39.0 KB  (JS 39.0 + wasm 0.0)
yew        58.5 KB  (JS 6.2 + wasm 52.3)
dioxus    216.3 KB  (JS 10.4 + wasm 205.9)
```

The same as each counter's own Short (Leptos measured 34.7 there: its page's inline script differs by a few bytes
from run to run).

## The screenshots

`../shots.mjs` (Quillo, `quillo run`, port 8127) and `shots-site.mjs` (Sycamore, its site from the run above, served
on 4200) click each counter three times and check that it says "6 3 doubled is 6"; 320x128 at 3x.
