# How the six Groceries apps were made and measured

Videos 208-211 ("Reactivity, side by side") all use these apps. Measured 2026-11-23 on an Apple M5 (10 cores, 16 GB),
macOS 26.7.1, Node 24.11.0, rustc 1.99.0, Chromium 153.0.8010.12 (Playwright). The laptop was busy with other work
(load average 6 to 8 while measuring), so the times are context; the counts are what the video shows, and they were
the same in each of the 21 rounds.

## The apps

One app, Groceries: 50 items (shared/items.mjs: name, price in cents, quantity, ticked), an "Add an item" box, a
filter box, "N left · $total" (the total of what's left), and a row per item with a checkbox and a remove button.
Each has an App component and a Row component, one stylesheet (shared/groceries.css), and the items written into its
own language by `node shared/make-items.mjs`. Each follows its own docs, the usual way:

- **React** (`react/`): `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`; React 19.3.1,
  Vite 8.3.8. `useState`, and the derived values as plain code in the function.
- **React with its compiler** (`react-compiler/`): `npm create vite@9.3.4 react-compiler -- --template react-compiler
  --no-interactive --no-immediate` (babel-plugin-react-compiler 1.0.0), with react/'s src/ copied in unchanged.
- **Vue** (`vue/`): `npm create vue@3.24.0 vue -- --eslint` (`--default` gives TypeScript; the others are JavaScript);
  Vue 3.5.46. `ref`, `computed`, a GroceryRow.vue with props and emits.
- **Svelte** (`svelte/`): `npm create vite@9.3.4 svelte -- --template svelte --no-interactive --no-immediate`; Svelte
  5.59.1. Vite's Svelte starter, not SvelteKit's `sv create`, so all four JavaScript apps are single-page apps on Vite.
  `$state`, `$derived`, `$props`.
- **Solid** (`solid/`): `npm create solid@0.13.0 -- -p solid --solid -t bare --js --no-devtools`; solid-js and
  @solidjs/web 2.0.3. `createStore` (written through the draft), `createSignal`, `createMemo`, `<For>`. Its build is
  dist/client.
- **Dioxus** (`dioxus/`): `dx new dioxus --subtemplate Bare-Bones --yes -o is_fullstack=false -o is_router=false
  -o is_tailwind=false -o default_platform=web` with dx 0.7.10 (Cargo.lock: dioxus 0.7.10); the crate renamed
  `groceries` (a crate named `dioxus` can't depend on dioxus) and the `authors` line dx writes taken out. `use_signal`,
  `use_memo`, a `Row` taking two `EventHandler`s. The variant (variants/dioxus-signal-row.rs) gives Row the items
  signal in their place.
- **Quillo** (`../app/main.qwe`): Quillo 0.8.10; `state`, `let`, a Row component with two function props.
  `quillo check` passes.

Starter files the app doesn't use (logos, demo components, their CSS) were removed. `npm install --ignore-scripts`.

## Checked

`node check.mjs <name>=<url> ...` clicks through each app (filter "ap", clear it, tick Bananas, remove Bread, add
Basil) and prints what it shows at each step; runs/check.txt ends with each app "the same as react, step by step".
Quillo puts each component in a `<quillo-island style="display: contents">` element, so `li:last-child` matches every
row there: check.mjs reads the last `.name` instead.

## Measured

`sh build.sh` builds each for production into .build/ (logs in runs/build-*.txt). Dioxus's two builds each get their
own CARGO_TARGET_DIR and an empty public/: with one target, dx bundled the other crate's newest wasm. Both are
built with `--debug-symbols false` (below). build.sh also
saves what React Compiler made of App (an unminified build) as runs/compiled-app.js.

`sh measure.sh` (servers: `node serve.mjs .build/<name> <port>`, 5181-5187, and `quillo run main.qwe --port 8096`)
runs check.mjs, then measure.mjs, which makes each change once to warm up and then 21 times (undone between):

- **draft**: a letter typed in the "Add an item" box
- **filter**: "a" typed in the filter (29 of 50 rows stay)
- **tick**: Bananas ticked
- **add**: Basil added (the button clicked; the name typed before)

For each it counts:

- **Code that ran**: each component has one line, `ran("Row")` (count.js; Quillo calls it with `js("ran", ["Row"])`
  from public/count.js; Dioxus through wasm-bindgen, count.rs). For Vue, a component's setup runs once and its render
  again on each update, so Vue's components count in setup and in `onBeforeUpdate`. React's counts were checked against
  React's own commits read through a DevTools hook (as videos/115's counters.js does): the same in every case.
- **DOM writes**: a MutationObserver on the document: each node added or removed, each attribute and text set; "net"
  counts only the attributes and texts whose value at the end differs from before the change.
- **Time**: from the key or pointer event (performance.now in a capture listener) to the last DOM write; every median
  under 1 ms (performance.now is coarse here: 0.1 ms steps).

runs/measure.txt has the table and runs/measure.json every round. Why React writes so much: its code for controlled
inputs sets each checkbox's `type` and `name` again whenever the row renders (net: nothing). Why React Compiler still
runs the rows for a letter in the Add box: runs/compiled-app.js caches `shown` in the block checked against `draft`.

**Payload**: shots.mjs records each URL a page uses through its first tick, downloads each again asking for gzip
(serve.mjs gzips text and wasm, as a static host does; Quillo gzips its own), and counts the bytes as sent; count.js,
the measuring line, is left out. It also counts the rows in the first HTML: 0 for the five built in the browser, 50 for
Quillo's, which the server renders and the runtime (`/_quillo/r/...js`) resumes with the component's code
(`/_quillo/b/...js`); both load with the page. Dioxus is built with `--debug-symbols false`: dx 0.7.10 keeps them in a
release build by default, which makes the wasm 2,081,669 bytes (514,554 gzipped) where it is 575,464 (235,514) without
(runs/dioxus-debug-symbols.txt).

The screenshots outline each written element in #166534 (7.1:1 against white), 4 px, 2 px outside it.

`node shots.mjs` (in the video's folder) does all of the above, then takes the screenshots with each written element
outlined in green, and saves everything in assets/runs.json.
