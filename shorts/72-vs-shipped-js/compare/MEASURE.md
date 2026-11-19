# What a counter downloads, six ways: the measurements

Every number in the Short (the terminal in `../video.json`) comes from `downloads.mjs`, whose whole output is
`downloads.txt`, copied here. Measured on one machine, on one day; your numbers will vary.

- **When:** Thu Nov 19 14:37:19 +08 2026 (`date`, as the run started)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0; **npm:** 11.6.1; **Vite:** 8.3.8 (React, Vue, Svelte, Solid)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

KB is 1,000 bytes. Everything ran under `taskpolicy -b`; bytes don't depend on how busy the machine is.

## The six counters

The same counter in each: a button that shows `doubled`, and "{count} doubled is {doubled}", with `doubled`
following `count` the way each framework's docs write a derived value.

| App | Where | Its starter | The counter |
|---|---|---|---|
| React 19.3.1 | `react/` | `npm create vite@latest react -- --template react` (74 packages) | `src/App.jsx`: `useState`, and `const doubled = count * 2` in the render |
| Vue 3.5.45 | `vue/` | `npm create vue@latest -- --default --bare vue` (187 packages) | `src/App.vue`: `ref`, and `computed` |
| Svelte 5.58.0 | `../../64-vs-svelte-counter/compare/svelte` | `npx sv create`, minimal (SvelteKit 3.4.0) | `$state` and `$derived`, from Svelte's docs |
| Angular 21.2.26 | `../../74-vs-angular-counter/compare/counter` | `ng new --defaults` | `signal()` and `computed()` |
| Solid 2.0.1 | `../../76-vs-solid-counter/compare/solid` | `npm create solid -- --solid -t bare` | `createSignal`, and a derived function |
| Quillo 0.8.6 | `../app` | none (one file) | `state count` and `let doubled` |

The Svelte, Angular and Solid counters are the ones their own Shorts measured; each of those folders' MEASURE.md
has the details (Angular is 21.2, since Angular 22's CLI needs Node 24.15 or newer; its starter sets up the
router, so its build has it).

## How it's measured

`downloads.mjs` builds each app first, so every build is of today: `npm run build` (React, Vue, Svelte, Solid),
`npx ng build` (Angular); Quillo has no build. Then, one app at a time, it serves the build (`vite preview`;
Angular's `dist/counter/browser` as it is, by `serve-dist.mjs`; Quillo by `quillo run main.qwe`), opens the page
in a fresh browser (no cache), waits a second, clicks the button once, waits for the page to say
"2 1 doubled is 2" (it stops if it doesn't), and waits one more second for anything late. Every script response,
and every inline `<script>` in an HTML page (not JSON data), is saved and taken with `gzip -9 -c FILE | wc -c`; the
servers' own compression isn't used. The sizes are summed per app.

```
$ node downloads.mjs out
solid     13.8 KB  (1 piece, 33810 B before gzip)
vue       24.6 KB  (1 piece, 63275 B before gzip)
svelte    33.2 KB  (11 pieces, 84539 B before gzip)
quillo    39.0 KB  (4 pieces, 137386 B before gzip)
angular   58.2 KB  (1 piece, 190935 B before gzip)
react     67.8 KB  (1 piece, 219729 B before gzip)
```

The same numbers as each Short that measured one of these alone with `measure-js.mjs` (Svelte 33.2, Angular 58.2,
Solid 13.8, Quillo 39.0), and as `../../62-vs-react-setup` (React 67.8, there with "Clicked {count} times").

## The screenshots

`../shots.mjs` (Quillo, `quillo run`, port 8120) and `shots-react.mjs` (React, `npx vite`, port 5178) click each
counter three times and check that it says "6 3 doubled is 6", 320x128 at 3x. React's page keeps the Vite
starter's `index.css`, which styles the button.
