# React Quirks #5: what was run

Every page in the video was opened and clicked in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page
showed and what the browser's console said in `../assets/runs.json`; `../make-video.py` checks the narration against it. One machine.

- **When:** Fri Nov 20 2026 18:08:39 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **React and react-dom:** 19.3.1; **Vite:** 8.3.8; **oxlint:** 1.94.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@9.3.4 react -- --template react --no-interactive --no-immediate`, then
  `npm install`. Each quirk is a file in `src/` with its fix beside it (`Note.jsx`, `NoteFixed.jsx`, ...); `App.jsx` shows one by the
  address's hash (`#note`, `#note-fixed`); `index.css` is the shared styles (`../quirks.css`); the title is "React Quirks". The
  starter's `main.jsx`, with StrictMode, is as it was. Run as `npm run dev` runs it: `vite` on 5173.
- **Quillo** (`../main.qwe`): the same five pages, at `/note` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | React, as written | React, fixed | Quillo |
|---|---|---|---|
| Note (open it) | (a blank page) | Note / Don't forget the cake! | Note / Don't forget the cake! |
| Profile (open it) | (a blank page) | Profile / Ana, Cebu | Profile / { name: "Ana", city: "Cebu" } |
| Likes (Like three times) | Likes / 0 likes / Like | Likes / 3 likes / Like | Likes / 3 likes / Like |
| Welcome (open it) | Welcome / HelloAna! | Welcome / Hello Ana! | Welcome / Hello Ana! |
| Inbox (open it) | Inbox / 0 | Inbox | Inbox |

Quillo with the React habits, swapped into the running program: "Hello" and `<b>` on lines of their own, `Welcome / HelloAna!`; `{count && ...}`, `Inbox / You have 0 new messages`.

## What the console and the checkers said

React's errors, each taking its page away: Note, `The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.` Profile, `Objects are not valid as a React child (found: object with keys {name, city}). If you meant to render a collection of children, use an array instead.`

React's console on Likes: `Invalid DOM property `class`. Did you mean `className`?` and `Invalid event handler property `onclick`. Did you mean `onClick`?`

`quillo check main.qwe`: `main.qwe: ok (6 routes, 1 function, 5 components)`. With the habits (each a one-line change to a copy):

```
main.qwe:38: warning: "Hello" and <b> are on lines of their own, so no space comes between them on the page: write {" "} between them, or put them on one line
main.qwe: ok (6 routes, 1 function, 5 components), 1 warning

main.qwe:48: warning: `count` counts as true even when it is 0 (unlike JavaScript), so `&&` always goes on: write `count != 0 && ...`
main.qwe: ok (6 routes, 1 function, 5 components), 1 warning
```

`npm run lint` in `react/` (the starter's oxlint, its own settings) printed no warnings:

```
> react@0.0.0 lint
> oxlint
```
