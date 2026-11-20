# React Quirks #3: what was run

Every page in the video was clicked and typed into in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each
page showed, and its fields, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 17:46:22 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **React and react-dom:** 19.3.1; **Vite:** 8.3.8; **oxlint:** 1.94.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`, then
  `npm install`. Each quirk is a file in `src/` with its fix beside it (`Players.jsx`, `PlayersFixed.jsx`, ...); `App.jsx` shows one by
  the address's hash (`#players`, `#players-fixed`); `index.css` is the shared styles (`../quirks.css`); the title is "React Quirks".
  The starter's `main.jsx`, with StrictMode, is as it was. Run as `npm run dev` runs it: `vite` on 5173.
- **Quillo** (`../main.qwe`): the same five pages, at `/players` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | React, as written | React, fixed | Quillo |
|---|---|---|---|
| Players (Ana +1 three times, then Next player) | Players / Max / 3 / +1 / Next player | Players / Max / 0 / +1 / Next player | Players / Max / 0 / +1 / Next player |
| Seating notes (notes for Ana and Ben, then Ana out) | Seating notes / Ben / ✕ / Cy / ✕; 'Ben: vegetarian', 'Cy: window seat' | Seating notes / Ben / ✕ / Cy / ✕; 'Ben: window seat', 'Cy: ' | Seating notes / Ben / ✕ / Cy / ✕; 'Ben: window seat', 'Cy: ' |
| Likes (Like three times) | Likes / 0 likes / Like | Likes / 3 likes / Like | Likes / 3 likes / Like |
| Clicker (Add one three times) | (a blank page) | Clicker / 3 / Add one | Clicker / 3 / Add one |
| Profile (type "hello") | Profile / 1 of 80 letters; 'h' | Profile / 5 of 80 letters; 'hello' | Profile / 5 of 80 letters; 'hello' |

Quillo's seating list without `key={guest}` (rows kept by place): 'Ben: vegetarian', 'Cy: window seat', and `quillo check` said `main.qwe: ok (6 routes, 1 function, 8 components)`.

React's Clicker page threw as it rendered: `Too many re-renders. React limits the number of renders to prevent an infinite loop.`. No other page threw.

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 1 function, 8 components)`. The React habits, written in Quillo (each a one-place change to a copy of main.qwe):

```
# onclick on <LikeButton>, in place of on_like
main.qwe:46: error: <LikeButton> has no parameter `onclick`
main.qwe:46: error: <LikeButton> needs `on_like`
quillo: 2 errors

# onclick={add()}
main.qwe:60: error: `@click` needs a function, got null: a handler is a function, `@click={() => ...}` (or `onclick`); text is never run as code
quillo: 1 error

# a component inside Profile (../assets/habit-profile.qwe)
main.qwe:71: error: `server fn` and `component` must be declared at the top level
quillo: 1 error
```

`npm run lint` in `react/` (the starter's oxlint, its own settings):

```
> react@0.0.0 lint
> oxlint

src/Clicker.jsx:14:24: warning react(set-state-in-render): Cannot call setState during render help: Calling setState during render may trigger an infinite loop. * To reset state when other state/props change, store the previous value in state and update conditionally. * To derive data from other state/props, compute the derived data during render without using state
src/Profile.jsx:13:8: warning react(static-components): Cannot create components during render help: Components created during render will reset their state each time they are created. Declare components outside of render
```
