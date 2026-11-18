# React Router vs Quillo, typed routes: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 13:23:40 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vite:** 9.3.4; **Vite:** 8.3.8; **React:** 19.3.1; **React Router:** 8.5.1
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive --no-immediate`,
  then `npm install` and `npm install react-router`. `src/App.jsx` is replaced by the guide, `src/index.css` by its
  styles (the same file as `../app/trails.css`), `src/trails.js` is added, and `index.html`'s title is "Trail Guide".
  `variants/`: `naive.jsx` (createBrowserRouter; the trail page reads `useParams()` and finds the trail) and `loader.jsx`
  (a loader that throws `data('No such trail', { status: 404 })`, and an `errorElement` on each route).
- **Quillo** (`../app/main.qwe`, with `trails.json`): `route GET /trails/:id(int)`, a 404 with a page of its own for a
  missing trail, and a last `route GET /*rest` for every other address. `quillo check` prints `main.qwe: ok (3 routes, 2 functions, 0 components)`.

Non-blank lines: naive.jsx 34, loader.jsx 56; Quillo's main.qwe 25, with its routes.

## Six addresses, each way (visit.mjs, status.sh)

`build-variants.sh` builds both React versions for production; shots.mjs serves them with `vite preview` (4173 naive, 4174
loader) and Quillo with `quillo run main.qwe` (8080). `visit.mjs` asks each address with `fetch` (the status), then opens it
in Chromium (the heading and text once the scripts have run, and the console's errors). On Quillo's 404 pages the one
console line is Chromium's own note of the status ("Failed to load resource: ... 404"), not an error of the page's.

### naive.jsx
| Address | Status | First heading | Page text (first lines) | Console errors |
|---|---|---|---|---|
| / | 200 | Trail Guide | Trail Guide / Fern Gully Loop / Eagle Ridge | none |
| /trails/2 | 200 | Eagle Ridge | ← All trails / Eagle Ridge / 9.8 km · 640 m climb · hard | none |
| /trails/abc | 200 | (none) | Unexpected Application Error! / Cannot read properties of undefined (reading 'name') / TypeError: Cannot read properties of undefined (reading 'name') | TypeError: Cannot read properties of undefined (reading 'name'); React Router caught the following error during render TypeError: Cannot read properties of undefined (reading 'name') |
| /trails/999 | 200 | (none) | Unexpected Application Error! / Cannot read properties of undefined (reading 'name') / TypeError: Cannot read properties of undefined (reading 'name') | TypeError: Cannot read properties of undefined (reading 'name'); React Router caught the following error during render TypeError: Cannot read properties of undefined (reading 'name') |
| /trails/02 | 200 | Eagle Ridge | ← All trails / Eagle Ridge / 9.8 km · 640 m climb · hard | none |
| /nope | 200 | (none) | Unexpected Application Error! / 404 Not Found | none |

### loader.jsx
| Address | Status | First heading | Page text (first lines) | Console errors |
|---|---|---|---|---|
| / | 200 | Trail Guide | Trail Guide / Fern Gully Loop / Eagle Ridge | none |
| /trails/2 | 200 | Eagle Ridge | ← All trails / Eagle Ridge / 9.8 km · 640 m climb · hard | none |
| /trails/abc | 200 | 404: No such trail | ← All trails / 404: No such trail | none |
| /trails/999 | 200 | 404: No such trail | ← All trails / 404: No such trail | none |
| /trails/02 | 200 | Eagle Ridge | ← All trails / Eagle Ridge / 9.8 km · 640 m climb · hard | none |
| /nope | 200 | 404: Error: No route matches URL "/nope" | ← All trails / 404: Error: No route matches URL "/nope" | none |

### Quillo
| Address | Status | First heading | Page text (first lines) | Console errors |
|---|---|---|---|---|
| / | 200 | Trail Guide | Trail Guide / Fern Gully Loop / Eagle Ridge | none |
| /trails/2 | 200 | Eagle Ridge | ← All trails / Eagle Ridge / 9.8 km · 640 m climb · hard | none |
| /trails/abc | 404 | 404: No such page | ← All trails / 404: No such page | Failed to load resource: the server responded with a status of 404 (Not Found) |
| /trails/999 | 404 | 404: No such trail | ← All trails / 404: No such trail | Failed to load resource: the server responded with a status of 404 (Not Found) |
| /trails/02 | 404 | 404: No such page | ← All trails / 404: No such page | Failed to load resource: the server responded with a status of 404 (Not Found) |
| /nope | 404 | 404: No such page | ← All trails / 404: No such page | Failed to load resource: the server responded with a status of 404 (Not Found) |

`status.sh` on the naive build and on Quillo (the terminal scenes):

```
$ ./status.sh http://localhost:4173
200  /trails/2
200  /trails/abc
200  /trails/999
200  /trails/02
200  /nope
$ ./status.sh http://localhost:8080
200  /trails/2
404  /trails/abc
404  /trails/999
404  /trails/02
404  /nope
```
