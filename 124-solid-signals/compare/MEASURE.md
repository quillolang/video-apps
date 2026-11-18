# Solid 2.0 vs Quillo, the closest cousin: the measurements

Every result in the video comes from the runs below, with what they printed, copied from the run. `../shots.mjs` runs
them and keeps the results in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 11:29:05 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-solid:** 0.13.0; **solid-js** and **@solidjs/web:** 2.0.0; **@solidjs/vite-plugin:** 3.0.1; **Vite:** 8.3.8; **eslint-plugin-solid:** 0.20.0 in **oxlint** 1.92.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Solid** (`solid/`): Solid's own CLI, `npm create solid@latest -- -p solid --solid -t bare --js --no-devtools`, then
  `npm install`. `src/App.jsx` is replaced by the splitter, `src/App.css` by its styles (the same file as
  `../app/split.css`), and `src/Document.jsx`'s title is "Tip Splitter". Every other file is the starter's.
  `variants/` holds the three versions:
  - `fixed.jsx`: `const total = () => bill() * (1 + tip() / 100);` and `function Share(props)` (`src/App.jsx` is this one);
  - `body.jsx`: `const total = bill() * (1 + tip() / 100);`, a number worked out in the component's body;
  - `destructure.jsx`: `function Share({ people, each })`.
- **Quillo** (`../app/main.qwe`): the same app; `let total = dec(bill ?? 0) * (100 + tip) / 100` in the body, and
  `component Share(people: int, each: dec)`. `quillo check` prints `main.qwe: ok (1 route, 1 function, 2 components)`.

Non-blank lines: Solid's fixed.jsx 36; Quillo's main.qwe 30, with its route.

Solid's docs, "Reactivity" (docs.solidjs.com/concepts/reactivity): "Solid does not re-run components", "The place where
you read a value decides whether Solid can see the read", and under "A value renders once and never updates": "Development
prints `[STRICT_READ_UNTRACKED]`", and "Destructuring props is the same problem in a different shape".

## 1. Each app, used (play.mjs)

`build-variants.sh` builds each Solid version for production (`vite build`, each copied over `src/App.jsx` in turn). The
starter's start mode writes the page to `dist/client` whatever `--outDir` says, and `vite preview` serves the project's own
`dist/client` whatever `--outDir` says (all three ports served the last build when tried), so each build is copied and
served with `serve.mjs` (static files, gzipped as vite preview does), on 4173 to 4175. Quillo runs with
`quillo run main.qwe` (8080). `play.mjs` clicks 20%, then +, then types 90 into the bill, and reads the page after each;
page changes are MutationObserver records under `<body>` since the step before (the start counts from the page's load).
Console errors and warnings, in every app: none.

### fixed.jsx (downloaded 16812 bytes)
| After | Total | Share | People | Tip lit | Page changes |
|---|---|---|---|---|---|
| start | Total: $69.00 | 2 people pay $34.50 each | 2 people | 15% | 0 |
| tip20 | Total: $72.00 | 2 people pay $36.00 each | 2 people | 20% | 4 |
| people3 | Total: $72.00 | 3 people pay $24.00 each | 3 people | 20% | 3 |
| bill90 | Total: $108.00 | 3 people pay $36.00 each | 3 people | 20% | 2 |

### body.jsx (16806 bytes)
| After | Total | Share | People | Tip lit | Page changes |
|---|---|---|---|---|---|
| start | Total: $69.00 | 2 people pay $34.50 each | 2 people | 15% | 0 |
| tip20 | Total: $69.00 | 2 people pay $34.50 each | 2 people | 20% | 2 |
| people3 | Total: $69.00 | 3 people pay $23.00 each | 3 people | 20% | 3 |
| bill90 | Total: $69.00 | 3 people pay $23.00 each | 3 people | 20% | 0 |

### destructure.jsx (16820 bytes)
| After | Total | Share | People | Tip lit | Page changes |
|---|---|---|---|---|---|
| start | Total: $69.00 | 2 people pay $34.50 each | 2 people | 15% | 0 |
| tip20 | Total: $72.00 | 2 people pay $34.50 each | 2 people | 20% | 3 |
| people3 | Total: $72.00 | 2 people pay $34.50 each | 3 people | 20% | 1 |
| bill90 | Total: $108.00 | 2 people pay $34.50 each | 3 people | 20% | 1 |

### Quillo (48575 bytes)
| After | Total | Share | People | Tip lit | Page changes |
|---|---|---|---|---|---|
| start | Total: $69.00 | 2 people pay $34.50 each | 2 people | 15% | 20 |
| tip20 | Total: $72.00 | 2 people pay $36.00 each | 2 people | 20% | 5 |
| people3 | Total: $72.00 | 3 people pay $24.00 each | 3 people | 20% | 3 |
| bill90 | Total: $108.00 | 3 people pay $36.00 each | 3 people | 20% | 2 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped).

## 2. In development

Each trap in Solid's dev server (`npx vite`, port 5173), after clicking 20%: body.jsx showed `Total: $69.00`
and destructure.jsx `2 people pay $34.50 each`, and the console said:

```
[STRICT_READ_UNTRACKED] Reactive value "bill" read directly in <App> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
[STRICT_READ_UNTRACKED] Reactive value "tip" read directly in <App> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

```
[STRICT_READ_UNTRACKED] Reactive value "people" read directly in <Share> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
[STRICT_READ_UNTRACKED] Reactive value "bill" read directly in <Share> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
[STRICT_READ_UNTRACKED] Reactive value "tip" read directly in <Share> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
[STRICT_READ_UNTRACKED] Reactive value "people" read directly in <Share> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

## 3. Solid's lint rules (lint.sh)

The starter's `oxlint.config.js` loads eslint-plugin-solid's v2 config (`solid/no-destructure`: error,
`solid/reactivity`: warning, among 35 rules). Its `npm run lint` (`oxlint src`) printed no findings for any version here;
with the config named, `oxlint -c oxlint.config.js`, the rules run:

```
$ ./lint.sh
== body.jsx
body.jsx:16:17: warning solid(reactivity): The reactive variable 'bill' should be used within JSX, a
    tracked scope (like createEffect), or inside an event handler function, or else changes will be ignored.
body.jsx:16:31: warning solid(reactivity): The reactive variable 'tip' should be used within JSX, a
    tracked scope (like createEffect), or inside an event handler function, or else changes will be ignored.
== destructure.jsx
destructure.jsx:4:16: error solid(no-destructure): Destructuring component props breaks Solid's
    reactivity; use property access instead.
== fixed.jsx
no problems
```
