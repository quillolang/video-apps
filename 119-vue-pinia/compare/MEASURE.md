# Vue vs Quillo, sharing a player: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 11:48:52 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0 (the starter asks for ^22.18.0 or >=24.12.0: npm warned EBADENGINE, and everything below ran); **npm:** 11.6.1
- **create-vue:** 3.24.0; **Vue:** 3.5.45; **Pinia:** 4.1.0; **Vite:** 8.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Vue** (`vue/`): Vue's own starter with Pinia, `npm create vue@latest vue -- --pinia`, then `npm install`. `src/` holds
  the app (App.vue, components/, stores/player.js, tracks.js) beside the starter's own HelloWorld components and
  stores/counter.js, unused; `src/assets/main.css` is the app's styles (the same file as `../app/mixtape.css`) and
  `index.html`'s title is "Mixtape". `variants/` holds the four versions:
  - `drilling/`: the App keeps what's playing and the queue; NowPlaying takes them as props; TrackActions emits play and
    enqueue, and TrackRow and TrackList declare and emit them again;
  - `provide/`: the App provides them (`provide('player', ...)`), NowPlaying and TrackActions inject them;
  - `pinia/`: a setup store (`stores/player.js`); NowPlaying reads it with `storeToRefs`, TrackActions takes its actions;
  - `pinia-destructure/`: the same, with NowPlaying's `const { now, queue } = usePlayerStore()`, no storeToRefs.
- **Quillo** (`../app/main.qwe`, with `tracks.json`): `state playing` and `state queue` at the top of the program,
  the page's state. `quillo check` prints `main.qwe: ok (1 route, 1 function, 2 components)`.

Files and non-blank lines (each variant's App.vue, components/ and stores/; tracks.js beside them is not counted, nor
Quillo's tracks.json): drilling 5 files, 69 lines; provide
5, 63; pinia 6, 68;
pinia-destructure 6, 67; Quillo 1, 28.

Pinia's docs, "Defining a Store" (pinia.vuejs.org/core-concepts): "`store` is an object wrapped with `reactive` ... like
`props` in `setup`, **we cannot destructure it**", and "In order to extract properties from the store while keeping its
reactivity, you need to use `storeToRefs()`".

## Each app, played (play.mjs)

`build-variants.sh` builds each version for production (`vite build`, each variant copied into `src/` in turn);
shots.mjs serves them with `vite preview` (4173 to 4176) and Quillo with `quillo run main.qwe` (8080). `play.mjs`
clicks ▶ on Paper Moon Pie, then ＋ on Neon Rain and on Lemon Tree Lane, reading the header after each; page changes are
MutationObserver records since the step before (the start counts from the page's load). Console errors and warnings:
none, in every app. In Vue's dev server, the destructured store also showed `Nothing playing · 0 queued` after ▶, with
nothing in the console.

### drilling (27932 bytes)
| After | Header | Page changes |
|---|---|---|
| start | Nothing playing · 0 queued | 0 |
| play | ▶ Paper Moon Pie — Luna Bakes · 0 queued | 1 |
| queue1 | ▶ Paper Moon Pie — Luna Bakes · 1 queued | 1 |
| queue2 | ▶ Paper Moon Pie — Luna Bakes · 2 queued | 1 |

### provide (27903 bytes)
| After | Header | Page changes |
|---|---|---|
| start | Nothing playing · 0 queued | 0 |
| play | ▶ Paper Moon Pie — Luna Bakes · 0 queued | 1 |
| queue1 | ▶ Paper Moon Pie — Luna Bakes · 1 queued | 1 |
| queue2 | ▶ Paper Moon Pie — Luna Bakes · 2 queued | 1 |

### pinia (29586 bytes)
| After | Header | Page changes |
|---|---|---|
| start | Nothing playing · 0 queued | 0 |
| play | ▶ Paper Moon Pie — Luna Bakes · 0 queued | 1 |
| queue1 | ▶ Paper Moon Pie — Luna Bakes · 1 queued | 1 |
| queue2 | ▶ Paper Moon Pie — Luna Bakes · 2 queued | 1 |

### pinia-destructure (29464 bytes)
| After | Header | Page changes |
|---|---|---|
| start | Nothing playing · 0 queued | 0 |
| play | Nothing playing · 0 queued | 0 |
| queue1 | Nothing playing · 0 queued | 0 |
| queue2 | Nothing playing · 0 queued | 0 |

### Quillo (40749 bytes)
| After | Header | Page changes |
|---|---|---|
| start | Nothing playing · 0 queued | 8 |
| play | ▶ Paper Moon Pie — Luna Bakes · 0 queued | 1 |
| queue1 | ▶ Paper Moon Pie — Luna Bakes · 1 queued | 1 |
| queue2 | ▶ Paper Moon Pie — Luna Bakes · 2 queued | 1 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped where the server gzipped them).
