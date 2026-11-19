# Leptos vs Quillo, a to-do list: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it printed,
copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 2026, about 17:02 +08 (the build's `date` is in build.txt)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Rust:** cargo and rustc 1.99.0; **trunk** 0.22.2 (in the project's .cache/rust-tools), wasm-bindgen 0.2.130,
  wasm-opt version_131. **Leptos** 0.8.23. **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-todo.mjs` (Leptos's screenshots and its
download) and `measure-js.mjs` (Quillo's download, as in `../../66-vs-vue-todo`). The build ran under `taskpolicy -b`
with 2 jobs, in the build folder of `../../73-vs-leptos-counter`, whose 173 crates it shares, so its time isn't in the
Short.

## The two apps

The to-do list of `../../66-vs-vue-todo` (Vue's tutorial): three to-dos, a box and Add Todo, and an X on each.

- **Leptos** (`todo/`): a copy of 73's project (cargo, `leptos` with `csr`, index.html, and the book's size settings:
  the `[profile.release]` and `data-wasm-opt="z"`), named `todo`, with `src/main.rs` replaced: a `Todo` struct,
  `signal` for the list, the box and the next id, an `add` closure (`e.prevent_default()`, push, clear the box), a
  `del` closure (`retain`), an `item` view for a row, and a `view!` with the form, an input with
  `bind:value=(text, set_text)`, and a `<For>` for the list. Built with `trunk build --release`.
- **Quillo** (`../app/main.qwe`): 66's, with its comment changed. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were used the same way: the three to-dos; "Make a Short" typed; added (four, and the box emptied); "Learn HTML"
taken off (three). `shots-todo.mjs` (Leptos's `dist/`, served as it is on 4201) and `../shots.mjs` (`quillo run`,
8128) check the list at each step; 320x200 at 3x.

## Build, and what the browser downloads until the first to-do is added

```
$ trunk build --release                 # build.txt
    Finished `release` profile [optimized] target(s) in 11.59s
$ ls -l dist        # sizes in bytes, and the names
 108052  todo-11f453ba93c2ddc9_bg.wasm
  31186  todo-75a9d9ea4ca5ea7.js
$ node shots-todo.mjs todo/dist l 4201 "Learn Leptos" <out>   # shots-leptos.txt
  JavaScript: 31441 B raw, 6443 B gzip -9
  WebAssembly: 108052 B raw, 44759 B gzip -9
  both: 51.2 KB gzip -9
$ node measure-js.mjs quillo <out>      # js-quillo.txt
  JavaScript: 4 pieces, 149769 B raw, 42814 B gzip -9 (41.8 KiB)
```

For 73's counter, tuned Leptos sent less than Quillo (34.7 KB against 39.0); for this list, Quillo sends less.

## Files and lines

`cargo new` makes 2 files; you add index.html. Quillo's starter makes 4.

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c todo/src/main.rs; c todo/index.html
52
7
$ c ../app/main.qwe
31
```

Leptos: 52 + 7 + the 4 lines of the size profile = 63 (rustfmt's own layout makes main.rs 59, not 52; the Short
counts the file as it is). Quillo: 31.
