# How the mistakes were made and tested

The apps are videos/208-reactivity-models' six Groceries apps (its compare/MEASURE.md says how each was made): React
19.3.1, Vue 3.5.46, Svelte 5.59.1, Solid 2.0.3, Dioxus 0.7.10, Quillo 0.8.10. Run 2026-11-23 on an Apple M5, Chromium
153 (Playwright), Node 24.11.0, rustc 1.99.0.

mistakes.json holds each mistake as edits ([file, from, to]) to one app. `node make.mjs [round ...] [--only=react,vue]`
copies the app into build/<round>-<app>, applies the edits, and records in runs/<round>-<app>.txt and runs/results.json:

- **The linter the starter came with**: React, `oxlint` (Vite's starter: the react and react-hooks rules);
  Solid, `oxlint -c oxlint.config.js` (eslint-plugin-solid's v2 rules); Vue, `eslint` (create-vue --eslint). Svelte's
  Vite starter has none (its compiler's warnings are in the build). oxlint finds no files when it walks the folders of
  this repository, so make.mjs names each source file.
- **The build**: `npx vite build`; `dx build --release --platform web --debug-symbols false`; Quillo has no build, so
  `quillo check main.qwe`.
- **In Chromium**: on a dev server (`vite`) and on the production build (Dioxus and Quillo: their one build), the
  round's scenario, then the summary line, whether the page still answers, and every console error and warning. Each
  production page is photographed after its scenario (../assets/<round>-<app>.png).

The rounds (the scenario in make.mjs):

- **inplace**: tick Bananas, the item changed in place and the same list handed back (Vue and Svelte unchanged: that is
  their own way). Right: "39 left · $552.78".
- **push** (an extra, not a round in the video): add Basil by pushing into the list. React shows it, by accident:
  clearing the box renders App again. Quillo's check warns of the dropped `push`.
- **derived**: tick Bananas with the total computed once. Right: "39 left · $552.78"; all six show $555.52.
- **effect**: an effect that counts changes to the list and reads the count it writes; wait 1.5 s, tick, wait 1.5 s.
- **race**: a search that answers "a" in 900 ms and longer queries in 150 ms (shared/search.js; Dioxus waits through
  `document::eval`, Quillo in a `server fn` with `sleep`); type "a", then "p" 60 ms later. Right: "3 found".

Quillo's two misses are reported as Q-1360 (a dropped `map`/`filter` is never warned of) and Q-1361 (`state x =` reading
another state runs once, unwarned) in quillo-app1's feedback/reports/FEEDBACK86.md.
