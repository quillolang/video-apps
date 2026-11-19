# A to-do list that saves, React + Express + SQLite vs Quillo: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 13:14:40 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **Page:** React 19.3.1 and react-dom 19.3.1 on Vite 8.3.8 (`npm create vite`); **API:** Express 5.3.0 and
  better-sqlite3 13.2.0 (its prebuilt darwin-arm64 binary, nothing compiled) (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

The scripts that measured are in this folder: `shots-react.mjs` (React + Express's screenshots). Everything ran
under `taskpolicy -b`.

## The two apps

The same list (the one in Vue's tutorial, as in `../../66-vs-vue-todo`), saved in SQLite: add a to-do, take one
off, and it's still there when the page is opened again.

- **React + Express** (`client/`, `server/`): the way it's usually split. The page is Vite's React starter
  (`npm create vite@latest client -- --template react`) with `src/App.jsx` replaced: `useState` for the list and
  the box, `useEffect` and `fetch` to load the list, and a `fetch` for each change (POST, DELETE), each answered
  with the whole list. `vite.config.js` gets three lines, a proxy that passes `/api` on to the API while you work.
  The API is `npm init -y` (with `"type": "module"` and a start script), Express and better-sqlite3:
  `server/server.js` makes the table, and has a route for each of the page's fetches. Every other file is the
  starters', unchanged (the page keeps the starter's `index.css`, which centres the text).
- **Quillo** (`../app/`): `main.qwe` opens the database and runs `migrations/001_todos.sql`, has three server
  functions (`list_todos`, `add_todo`, `remove_todo`), and a component that calls them. `quillo check` prints
  `main.qwe: ok (1 route, 3 functions, 1 component)`.

Both were used in a browser the same way, from an empty `todos.db`, by `../shots.mjs` and `shots-react.mjs`,
which check the list after each step: empty; three to-dos added; "Learn HTML" taken off; the page opened in a new
tab, with the same two. The screenshots are from Vite's dev server (port 5175, with the API on 3001) and
`quillo run` (8113), both 320x200 at 3x. Every line of each file is 50 characters or less, to fit the Short's
editor; the long ones were broken in two, on both sides.

## 1. Files the starters make

```
$ npm create vite@latest client -- --template react --no-interactive --no-immediate </dev/null
...
└  Done. Now run:

  cd client
  npm install
  npm run dev

$ find client -type f | sort
client/.gitignore
client/.oxlintrc.json
client/README.md
client/index.html
client/package.json
client/public/favicon.svg
client/public/icons.svg
client/src/App.css
client/src/App.jsx
client/src/assets/hero.png
client/src/assets/react.svg
client/src/assets/vite.svg
client/src/index.css
client/src/main.jsx
client/vite.config.js
$ mkdir server && cd server && npm init -y
```

15 files, and `npm init` makes 1 (`package.json`): 16. Quillo's starter, `quillo new hello --minimal`, makes 4
(`.gitignore`, `lib/greet.qwe`, `main.qwe`, `ui/page.qwe`; the same quillo, measured for
`../../64-vs-svelte-counter/compare/MEASURE.md`).

## 2. What you install, and its size

Whole outputs: `install-client.txt` and `install-server.txt` (each from an empty node_modules).

```
$ npm install                                  # in client/
added 72 packages, and audited 73 packages in 3s
$ npm install                                  # in server/, after npm install express better-sqlite3
added 67 packages, and audited 68 packages in 8s

$ npm ls --depth=0                             # in client/
client@0.0.0 .../compare/client
├── @types/react-dom@19.3.0
├── @types/react@19.3.0
├── @vitejs/plugin-react@6.3.0
├── oxlint@1.94.0
├── react-dom@19.3.1
├── react@19.3.1
└── vite@8.3.8
$ npm ls --depth=0                             # in server/
server@1.0.0 .../compare/server
├── better-sqlite3@13.2.0
└── express@5.3.0

$ du -sk client/node_modules server/node_modules
57208	client/node_modules
32624	server/node_modules
```

72 + 67 = 139 packages; 57,208 + 32,624 = 89,832 KiB, 88 MB (`du -sh`: 56M and 32M), with Node itself installed
first. Quillo is one file, 30,584,944 bytes, 29M (`du -h ../app/.quillo/bin/quillo`), with SQLite built in.

## 3. Lines you write

Non-blank lines, without `//` comments, counted the same way for every file:

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c client/src/App.jsx; c server/server.js
49
26
$ c ../app/main.qwe; c ../app/migrations/001_todos.sql
34
4
```

React + Express: 49 + 26, and the 3 lines added to `vite.config.js` (`server: {`, the proxy, `},`) = 78.
Quillo: 34 + 4 = 38.

## 4. Servers while you work

React + Express: two, each in its own terminal, `npm start` in `server/` (node server.js, port 3001) and
`npm run dev` in `client/` (vite, with the proxy; the screenshots' run used `npx vite --port 5175`). Quillo: one, `quillo run` (port 8113), which serves
the page, answers the server functions and opens the database. (In production, a build of the page can be served
by Express too, so React + Express can be one server there.)
