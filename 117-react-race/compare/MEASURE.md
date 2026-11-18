# React vs Quillo, the search race: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 12:23:18 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vite:** 9.3.4; **Vite:** 8.3.8; **React and react-dom:** 19.3.1; **@tanstack/react-query:** 5.108.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive --no-immediate`,
  then `npm install` and `npm install @tanstack/react-query`. `src/App.jsx` is replaced by the search, `src/index.css`
  by its styles (the same file as `../app/pantry.css`), `index.html`'s title is "Pantry Search", and `vite.config.js`
  passes `/api` to `api/server.mjs` (8081), in dev and in `vite preview`. `variants/`: `effect.jsx` (useEffect and
  fetch, no cleanup), `ignore.jsx` (the ignore flag set by the effect's cleanup, as react.dev shows for fetching in an
  effect), `query.jsx` (TanStack Query, keyed by the query). `npx oxlint src` reports nothing for any of them.
- **The API** (`api/server.mjs`): up to 8 of 70 foods (`api/foods.json`) that contain the query; one letter takes 900 ms
  and more take 150 ms.
- **Quillo** (`../app/main.qwe`): the same search as a `server fn` with the same delays, and
  `state results = live(search, query)`. `quillo check` prints `main.qwe: ok (1 route, 1 function, 1 component)`.

Non-blank lines: effect.jsx 22, ignore.jsx 28, query.jsx 28 (and the API's server.mjs);
Quillo's main.qwe 25, with the search and its route.

Quillo's guide (llms-full.txt, "The latest call wins"): "An older call's answer never replaces a newer value", and for
`live(load, id)`: "an answer still on its way for the old one is dropped".

## Each search, typed into (play.mjs)

`build-variants.sh` builds each React version for production; shots.mjs serves them with `vite preview` (4173 to 4175)
with the API on 8081, and Quillo with `quillo run main.qwe` (8080). `play.mjs` types "a", waits 100 ms, types "p", and
reads the page 0.5 s and 2 s after the "p". Console errors and warnings: none, in every app. The API's log, in the order
its answers went out (one race for each React version): `[{"q": "ap", "ms": 150}, {"q": "a", "ms": 900}, {"q": "ap", "ms": 150}, {"q": "a", "ms": 900}, {"q": "ap", "ms": 150}, {"q": "a", "ms": 900}]`.

### effect.jsx (downloaded 69148 bytes)
| When | Heading | Foods | Holding “ap” |
|---|---|---|---|
| soon | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |
| later | Results for “ap” | Apple, Apricot, Avocado, Almonds, Anchovies, Artichoke, Asparagus, Arugula | 2 of 8 |

### ignore.jsx (69167 bytes)
| When | Heading | Foods | Holding “ap” |
|---|---|---|---|
| soon | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |
| later | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |

### query.jsx (78749 bytes)
| When | Heading | Foods | Holding “ap” |
|---|---|---|---|
| soon | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |
| later | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |

### Quillo (46953 bytes)
| When | Heading | Foods | Holding “ap” |
|---|---|---|---|
| soon | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |
| later | Results for “ap” | Apple, Apricot, Capers, Grapefruit, Grapes, Maple syrup, Papaya, Paprika | 8 of 8 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped where the server gzipped them).
