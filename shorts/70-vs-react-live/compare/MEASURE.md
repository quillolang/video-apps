# Live updates between tabs, React + socket.io vs Quillo's live(): the measurements

Every number in the Short (the `versus` scene, and the "Order matters" slide, in `../video.json`) comes from a
command below, with what it printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 13:25:09 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **Page:** React 19.3.1 on Vite 8.3.8 (`npm create vite`) with socket.io-client 4.8.4; **server:** socket.io 4.8.4
  and better-sqlite3 13.2.0 (its prebuilt binary) (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

The scripts that measured are in this folder: `shots-react.mjs` (React + socket.io's screenshots) and
`late-tab.mjs` (the first try against the fix). Everything ran under `taskpolicy -b`.

## The two apps

A wall of notes: post one in a tab, and every open tab shows it, with nothing reloaded. Both keep the notes in
SQLite, so a tab opened later shows the whole wall.

- **React + socket.io** (`client/`, `server/`), as socket.io's own guide for React has it
  (https://socket.io/how-to/use-with-react): the socket in `src/socket.js` (the guide's URL line, pointed at this
  server), and the page listening on it in a `useEffect`, with `socket.off` on the way out. `server/server.js`
  is a socket.io server (with CORS for the page's dev server, as in the guide) that sends the wall to a tab when it
  connects, and to every tab after each post. Every other file is the starters', unchanged.
- **Quillo** (`../app/`): `main.qwe` with two server functions (`notes`, `post`), and a component whose
  `state items = live(notes)` runs `notes` again whenever the notes table changes, on every open page; and
  `migrations/001_notes.sql`. `quillo check` prints `main.qwe: ok (1 route, 2 functions, 1 component)`.

Both were used in a browser the same way, from an empty `wall.db`, by `../shots.mjs` and `shots-react.mjs`, which
check every tab's wall after each step: two tabs, both empty; tab A posts "Hi from tab A!", and both show it;
tab B posts "Hello back from B!", and both show both; then a third tab, opened last, must show both. The
screenshots are from Vite's dev server (port 5176, with the socket server on 3002) and `quillo run` (8114), both
320x160 at 3x. Every line of each file is 50 characters or less, to fit the Short's editor.

## Order matters: the first try

The first try (`variants/connect-early/`) made the socket as the guide's first example does, `io(URL)`, which
connects as soon as `socket.js` is imported, and listened in the effect. The server sends the wall as a tab
connects, and that came before React's effect had listened, so a tab opened after a post showed an empty wall.
The page as it is makes the socket with `autoConnect: false` (an option in the same guide) and calls
`socket.connect()` in the effect, after `socket.on`, with `socket.disconnect()` on the way out.

```
$ node late-tab.mjs
first try (connects as imported): empty, empty, empty, empty, empty
as it is (connects in the effect): shows it, shows it, shows it, shows it, shows it
```

(Each: tab A posts, then five new tabs are opened one after another, each given 3 seconds to show the note.)

## 1. Files the starters make

```
$ npm create vite@latest client -- --template react --no-interactive --no-immediate </dev/null
$ find client -type f | wc -l
      15
$ mkdir server && cd server && npm init -y
```

15 files (the same as in `../../68-vs-react-fullstack/compare/MEASURE.md`, listed there), and `npm init` makes 1
(`package.json`): 16. Quillo's starter, `quillo new hello --minimal`, makes 4.

## 2. What you install, and its size

Whole outputs: `install-client.txt` and `install-server.txt` (each from an empty node_modules).

```
$ npm install socket.io-client              # in client/
added 83 packages, and audited 84 packages in 19s
$ npm install socket.io better-sqlite3      # in server/
added 23 packages, and audited 24 packages in 6s

$ npm ls --depth=0                          # in client/
client@0.0.0 .../compare/client
├── @types/react-dom@19.3.0
├── @types/react@19.3.0
├── @vitejs/plugin-react@6.3.0
├── oxlint@1.94.0
├── react-dom@19.3.1
├── react@19.3.1
├── socket.io-client@4.8.4
└── vite@8.3.8
$ npm ls --depth=0                          # in server/
server@1.0.0 .../compare/server
├── better-sqlite3@13.2.0
└── socket.io@4.8.4

$ du -sk client/node_modules server/node_modules
64132	client/node_modules
34144	server/node_modules
```

83 + 23 = 106 packages; 64,132 + 34,144 = 98,276 KiB, 96 MB, right after the installs, with Node itself installed
first. Quillo is one file, 30,584,944 bytes, 29M, with SQLite built in.

## 3. Lines you write

Non-blank lines, without `//` comments, counted the same way for every file:

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c client/src/App.jsx; c client/src/socket.js; c server/server.js
35
6
24
$ c ../app/main.qwe; c ../app/migrations/001_notes.sql
24
4
```

React + socket.io: 35 + 6 + 24 = 65. Quillo: 24 + 4 = 28.

## 4. Servers while you work

React + socket.io: two, `npm start` in `server/` (the socket server, port 3002) and `npm run dev` in `client/`
(vite; the screenshots' run used `npx vite --port 5176`). Quillo: one, `quillo run` (port 8114).
