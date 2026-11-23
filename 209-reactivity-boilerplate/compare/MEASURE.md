# How the costs were measured

The apps are videos/208-reactivity-models' six Groceries apps (that folder's compare/MEASURE.md says how each was made).
Measured 2026-11-23 on an Apple M5 (10 cores, 16 GB), macOS 26.7.1, Node 24.11.0 with npm 11.6.1, rustc 1.99.0,
dx 0.7.10, Quillo 0.8.10. The laptop was busy with other work, so the build times are a guide.

`node size.mjs <scratch dir>` (run by ../shots.mjs, which saves everything in ../assets/runs.json) prints size.txt
and writes size.json:

- **Starter files**: each starter made again in the scratch folder by the same command as in 208 (`dx new` with
  `--vcs none`; Quillo's is `quillo new quillo --minimal`), every file counted, node_modules and .git left out.
- **Code**: the lines that aren't blank in the files the app is written in, its HTML shell included (index.html for
  React, Vue and Svelte; Solid's Document.jsx; the route in Quillo's main.qwe), without the shared items, stylesheet
  and count.js, and without the lines that only measure (`ran(...)`, `onBeforeUpdate(...)`, their imports).
- **Packages**: package.json's dependencies and devDependencies, and every package npm installed
  (node_modules/.package-lock.json), and node_modules' size (`du -sk`). For Dioxus, the crates its web build compiled
  (dx's "Compiled [n/175]"; Cargo.lock lists more, for desktop and mobile too), and the release build's target folder.
  Its one direct dependency is dioxus (wasm-bindgen was added only for counting).
- **Build**: `npx vite build` with dist and node_modules/.vite removed, then again; `dx build --release --platform web
  --debug-symbols false` into an empty CARGO_TARGET_DIR (the crates already downloaded), then again. Quillo has no
  build: `quillo check main.qwe` takes the median of 5 runs.
- **Shipped**: the bytes each page downloads, as sent (gzip), from 208's assets/runs.json.
- **Installed first** (shots.mjs): the node binary (a universal binary, x86_64 and arm64) and npm's folder, dx's
  binary, and the quillo binary that app/get-quillo.sh downloads. Rust's own size isn't compared: this machine's
  toolchain has many extra targets installed.
