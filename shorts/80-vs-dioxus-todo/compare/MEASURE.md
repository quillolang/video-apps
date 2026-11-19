# Dioxus vs Quillo, a to-do list: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 2026, about 17:05 +08 (the build's `date` is in build.txt)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0; **dioxus-cli** 0.7.10 (`dx`, in the project's .cache/rust-tools); **wasm-opt**
  version_131. **Dioxus** 0.7.10 (Cargo.lock). **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-todo.mjs` (Dioxus's screenshots and its
download) and `measure-js.mjs` (Quillo's download, as in `../../66-vs-vue-todo`). The build ran under `taskpolicy -b`
with 2 jobs, in the build folder of `../../67-vs-dioxus-counter`, whose 175 crates it shares (only this app's crate
was compiled), so its time isn't in the Short.

## The two apps

The to-do list of `../../66-vs-vue-todo` (Vue's tutorial): three to-dos, a box and Add Todo, and an X on each.

- **Dioxus** (`todo/`): a copy of 67's project (`dx new`, Bare-Bones, web, with the `authors` line taken out, and the
  guide's stable size settings in `.cargo/config.toml`), named `todo`, with `src/main.rs` replaced: a `Todo` struct,
  `use_signal` for the list, the box and the next id, an `add` closure (`e.prevent_default()`, push, clear the box)
  and a `remove` closure (`retain`), and an `rsx!` with the form, an input with `value` and `oninput`, and a `for` loop
  for the list. Built with `dx build --release --platform web`, then the guide's `wasm-opt -Oz` on its wasm.
- **Quillo** (`../app/main.qwe`): 66's, with its comment changed. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were used the same way: the three to-dos; "Make a Short" typed; added (four, and the box emptied); "Learn HTML"
taken off (three). `shots-todo.mjs` (Dioxus's built site, served as it is on 4202) and `../shots.mjs` (`quillo run`,
8129) check the list at each step; 320x200 at 3x.

## Build, and what the browser downloads until the first to-do is added

```
$ dx build --release --platform web     # build.txt
 16.62s  INFO Client build completed successfully! 🚀
$ wasm-opt public/assets/todo_bg-dxhb711a333eee957f.wasm -o (the same) -Oz
  739456 bytes before, 648730 after
$ node shots-todo.mjs public d 4202 "Learn Dioxus" <out>      # shots-dioxus.txt
  JavaScript: 45296 B raw, 11352 B gzip -9
  WebAssembly: 648730 B raw, 215704 B gzip -9
  both: 227.1 KB gzip -9
$ node measure-js.mjs quillo <out>      # js-quillo.txt
  JavaScript: 4 pieces, 149769 B raw, 42814 B gzip -9 (41.8 KiB)
```

(As in 73: a fresh browser, "Make a Short" added, the fourth to-do waited for, one more second; every script, inline
`<script>` and WebAssembly module, gzip -9.)

## Files and lines

`dx new` makes 10 files (listed in `../../67-vs-dioxus-counter/compare/MEASURE.md`); Quillo's starter makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*\(//\|#\)'; }
$ c todo/src/main.rs; c todo/.cargo/config.toml
56
7
$ c ../app/main.qwe
31
```

Dioxus: 56 + 7 = 63 (rustfmt's own layout makes main.rs 63, not 56; the Short counts the file as it is). Quillo: 31.
