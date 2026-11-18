# Solid 2.0 stores vs Quillo, nested state: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 12:14:27 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-solid:** 0.13.0; **solid-js** and **@solidjs/web:** 2.0.0; **Vite:** 8.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Solid** (`solid/`): Solid's own CLI, `npm create solid@latest -- -p solid --solid -t bare --js --no-devtools`, then
  `npm install`. `src/App.jsx` is replaced by the board, with `src/board.js` beside it; `src/App.css` is the board's
  styles (the same file as `../app/chores.css`), and `src/Document.jsx`'s title is "Chore Chart". `variants/`:
  - `draft.jsx`: `createStore`; star and move write through the setter's draft, as Solid 2.0 asks (`src/App.jsx` is this one);
  - `outside.jsx`: star writes `card.starred = !card.starred` on the store itself;
  - `spread.jsx`: star returns a new board from the setter, with `map` and spread.
- **Quillo** (`../app/main.qwe`, with `board.json`): one `state board`, changed by `star` and `move_on`, which return a
  new board (map and spread), and loops keyed by id. `quillo check` prints `main.qwe: ok (1 route, 2 functions, 1 component)`.

Non-blank lines: draft.jsx 44, spread.jsx 46; Quillo's main.qwe 36, with its route.

Solid's docs, "Stores" (docs.solidjs.com/concepts/stores): "Writing to the store outside the setter does nothing ... it does
not throw, it does not warn" (in development it did warn here, below), and "Every row rebuilds when one item changes: the
setter replaced the item objects, usually with `map` and a spread. `For` keys rows by object identity".

## Each board, used (play.mjs)

`build-variants.sh` builds each Solid version for production (copied from `dist/client`, where the starter's build writes
the page) and shots.mjs serves each copy with `serve.mjs` (4173 to 4175); Quillo runs with `quillo run main.qwe` (8080).
`play.mjs` clicks ☆ on Fold the laundry, → on Water the plants, then ☆ on Wash the dishes. Page changes are
MutationObserver records since the click; rows made again are `<li>` elements without the mark set on every `<li>` just
before the click. Console errors and warnings in production: none, in every app.

### draft.jsx (25572 bytes)
| After | To do | Doing | Done | Page changes | Rows made again |
|---|---|---|---|---|---|
| start | Water the plants, Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 0 | 0 |
| star | Water the plants, Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 2 | 0 |
| move | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 4 | 1 |
| star2 | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes ★, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 2 | 0 |

### outside.jsx (25555 bytes)
| After | To do | Doing | Done | Page changes | Rows made again |
|---|---|---|---|---|---|
| start | Water the plants, Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 0 | 0 |
| star | Water the plants, Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 0 | 0 |
| move | Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 4 | 1 |
| star2 | Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 0 | 0 |

### spread.jsx (25571 bytes)
| After | To do | Doing | Done | Page changes | Rows made again |
|---|---|---|---|---|---|
| start | Water the plants, Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 0 | 0 |
| star | Water the plants, Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 6 | 8 |
| move | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 4 | 1 |
| star2 | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes ★, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 6 | 8 |

### Quillo (45321 bytes)
| After | To do | Doing | Done | Page changes | Rows made again |
|---|---|---|---|---|---|
| start | Water the plants, Fold the laundry, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 0 | 0 |
| star | Water the plants, Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall | Make the bed ★, Sweep the porch | 2 | 0 |
| move | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 4 | 1 |
| star2 | Fold the laundry ★, Take out the bins, Feed the cat | Wash the dishes ★, Vacuum the hall, Water the plants | Make the bed ★, Sweep the porch | 2 | 0 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped).

## In development, and the lint rules

outside.jsx in Solid's dev server (`npx vite`), after ☆ on Fold the laundry: starred cards ['Make the bed\n★'], and the console:

```
[STORE_WRITE_OUTSIDE_SETTER] Writing store property "starred" outside its setter was ignored. Stores are read-only outside the setter's draft: use `setStore(s => { s.starred = value })`.
```

`npx oxlint -c oxlint.config.js src/App.jsx` (eslint-plugin-solid's v2 rules, with `solid/no-store-mutation-outside-setter`)
reported nothing for any of the three: draft [], outside [], spread [].
