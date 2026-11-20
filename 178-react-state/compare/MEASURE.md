# React Quirks #1: what was run

Every page in the video was clicked in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed in
`../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 17:07:57 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **React and react-dom:** 19.3.1; **Vite:** 8.3.8; **oxlint:** 1.94.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`, then
  `npm install`. Each quirk is a file in `src/` with its fix beside it (`Score.jsx`, `ScoreFixed.jsx`, ...); `App.jsx` shows one by the
  address's hash (`#score`, `#score-fixed`); `index.css` is the shared styles (`../quirks.css`); the title is "React Quirks". The starter's
  `main.jsx`, with StrictMode, is as it was. Run as `npm run dev` runs it: `vite` on 5173.
- **Quillo** (`../main.qwe`): the same five pages, at `/score` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | React, as written | React, fixed | Quillo |
|---|---|---|---|
| Score (+3, one click) | Score / 1 / +3 | Score / 3 / +3 | Score / 3 / +3 |
| Greeting (Rename to Max) | Greeting / Name: Max / Hi, Ana / Rename to Max | Greeting / Name: Max / Hi, Max / Rename to Max | Greeting / Name: Max / Hi, Max / Rename to Max |
| Groceries (Add eggs) | Groceries / milk / bread / Add eggs | Groceries / milk / bread / eggs / Add eggs | Groceries / milk / bread / eggs / Add eggs |
| Clicks (three clicks) | Clicks / 0 / Click me | Clicks / 3 / Click me | Clicks / 3 / Click me |
| Later (Keep it for later) | (a blank page) | Later / Thanks for waiting! / Keep it for later | Later / Thanks for waiting! / Keep it for later |

React's page for Later threw, as it rendered: `later is not a function`. No other page logged an error.

Quillo with `let clicks = 0` in place of `state clicks = 0` showed 0 after three clicks, and `quillo check` said `main.qwe: ok (6 routes, 2 functions, 5 components)`.

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 2 functions, 5 components)`. With `items.push("eggs")` in place of `items = items | push("eggs")` (line 47):

```
main.qwe:47: warning: `push` gives a new value and changes nothing, and it is dropped here: write `items = items | push(...)`
main.qwe: ok (6 routes, 2 functions, 5 components), 1 warning
```

`npm run lint` in `react/` (the starter's oxlint, its own settings):

```
> react@0.0.0 lint
> oxlint

src/Clicks.jsx:9:27: warning react(refs): Cannot access refs during render help: React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected
```
