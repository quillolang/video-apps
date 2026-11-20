# React Quirks #4: what was run

Every page in the video was used in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed, what
the browser's console said, and what the Quillo server logged, in `../assets/runs.json`; `../make-video.py` checks the narration
against it. Run on one machine.

- **When:** Fri Nov 20 2026 17:59:02 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **React and react-dom:** 19.3.1; **Vite:** 8.3.8; **oxlint:** 1.94.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`, then
  `npm install`. Each quirk is a file in `src/` with its fix beside it (`Chat.jsx`, `ChatFixed.jsx`, ...); `App.jsx` shows one by the
  address's hash (`#chat`, `#chat-fixed`); `index.css` is the shared styles (`../quirks.css`); the title is "React Quirks";
  `vite.config.js` adds the chat's API (POST and DELETE /api/join, GET /api/menu). The starter's `main.jsx`, with StrictMode, is as
  it was. Run as `npm run dev` runs it: `vite` on 5173, in development. Each chat page started with the chat empty (DELETE /api/join).
- **Quillo** (`../main.qwe`): the same five pages, at `/chat` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | React, as written | React, fixed | Quillo |
|---|---|---|---|
| Chat (open it; the fix: click Join) | Chat / Ana joined the chat / Ana joined the chat | Chat / Ana joined the chat / Join | Chat / Ana joined the chat |
| Seats (type "hello") | Seats / 200 seats, one for hello / makeSeats ran 12× | Seats / 200 seats, one for hello / makeSeats ran 2× | Seats / 200 seats, one for hello |
| Room (type "hello") | #general | #general | #general |
| Menu (open it) | (a blank page) | Menu / Pizza / Pasta / Salad | Menu / Pizza / Pasta / Salad |
| Stopwatch (Start, 3.3 s, Stop) | (a blank page) | Stopwatch / 3 s / Start | Stopwatch / 3 s / Start |

## What the console and the server said

Room, typing "hello": React's console had 13 lines (7 `connecting to #general`, 6 `leaving #general`); the fix's, 3 (connecting to #general, leaving #general, connecting to #general); Quillo's, 1 (connecting to #general), and its server printed the line once more as it made the page.

Seats, typing "hello": the Quillo server logged `make_seats runs` once, before `GET /seats -> 200 (26.0ms)`; the browser's console had nothing.

Chat: Quillo's server logged one `POST /_quillo/rpc/join_chat`.

Errors that took a React page away: Menu, `destroy is not a function`; Stopwatch, `Rendered more hooks than during the previous render.`.

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 4 functions, 5 components)`

`npm run lint` in `react/` (the starter's oxlint, its own settings):

```
> react@0.0.0 lint
> oxlint

src/Room.jsx:11:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on `options`, which changes every render help: Try memoizing this variable with `useRef` or `useCallback`.
src/Menu.jsx:8:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders help: Effects should synchronize React with external systems. Calling setState synchronously inside an effect starts another render and is usually unnecessary. Derive the value during render, initialize state directly, or update it from the event that caused the change. Use an effect only when synchronizing with an external system.
src/Menu.jsx:6:13: warning react-hooks(exhaustive-deps): Effect callbacks are synchronous to prevent race conditions. help: Consider putting the asynchronous code inside a function and calling it from the effect.
src/Stopwatch.jsx:8:5: error react-hooks(rules-of-hooks): React Hook "useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.
```
