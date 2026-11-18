# Sessions, Express and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 23:18:13 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **Express:** 5.3.0; **express-session:** 1.19.0; **cookie-session:** 2.1.1
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Playwright's Chromium

## The apps

The same page in both: "Your basket: N loaves", and a button that posts `loaf=Sourdough` to `/add`, which adds it to
the basket in the session and goes back to `/`.

- **Express** (`express/app.js`, 17 non-blank lines): express-session set up the way its readme shows, with a secret
  (`SESSION_SECRET`), `resave: false` and `saveUninitialized: false`, and its default store, MemoryStore. Run with
  `SESSION_SECRET=bakery-secret node app.js` (8090).
- **Express with cookie-session** (`express/variants/cookie.js`): the same app with one line changed,
  `app.use(cookieSession({ name: 'session', keys: [process.env.SESSION_SECRET] }))`: the session is kept in the cookie
  itself, signed.
- **Quillo** (`../app/main.qwe`, 12 non-blank lines): `session()` and `set_session(...)`. `quillo check` prints
  `main.qwe: ok (2 routes, 0 functions, 0 components)`. Run with `quillo run main.qwe --port 8080`, without
  `QUILLO_SECRET`, and then with it set.
- **Quillo, the basket in a table** (`../steps/table/main.qwe`, and `migrations/001_loaves.sql`, a table of loaves),
  as Quillo's guide says to keep a cart ("keep a cart or a draft in a table, keyed by an id in the session"): the
  session holds only the basket's id (`uuid()`, made at the first add), and each add inserts a row. `quillo check`
  prints `main.qwe: ok (2 routes, 0 functions, 0 components)`. Run with `QUILLO_SECRET` set.

## A restart (restart.sh)

`restart.mjs` starts the server itself, adds two loaves (two POSTs to `/add`), reads the basket, stops the server it
started (only that one), starts it again, and reads the basket with the same cookie. `./restart.sh <setup>` runs it for
each of the five:

```
express-session                before the restart: Your basket: 2 loaves; after: Your basket: 0 loaves
cookie-session                 before the restart: Your basket: 2 loaves; after: Your basket: 2 loaves
Quillo                         before the restart: Your basket: 2 loaves; after: Your basket: 0 loaves
Quillo, QUILLO_SECRET set      before the restart: Your basket: 2 loaves; after: Your basket: 2 loaves
Quillo, a table                before the restart: Your basket: 2 loaves; after: Your basket: 2 loaves
```

- express-session answers each POST with 302, Quillo with 303.
- express-session's MemoryStore keeps the sessions in the server's memory, so a restart loses them; the cookie
  (`connect.sid`, 80 characters in this run) is only the session's signed id.
- Quillo keeps the session in its cookie (`__Host-quillo_session`, 172 characters), signed. Without `QUILLO_SECRET`,
  the key is made when the server starts, so after a restart the old cookie's signature no longer checks and the
  session is empty. With `QUILLO_SECRET` set to the same value before and after, the basket is still there.
- The browser shots (`shots.mjs`) do the same in Chromium, clicking the button twice and reloading after the restart:
  the same results.

## Production (NODE_ENV=production)

`NODE_ENV=production SESSION_SECRET=bakery-secret node app.js` prints, on stderr, as it starts:

```
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
```

## What the cookie holds

The cookie-based sessions are signed, not hidden: their data is base64, and decodes as it is.

- cookie-session's `session` cookie: `{"basket":["Sourdough","Sourdough"]}` (with `session.sig` beside it).
- Quillo's, the part before the `.`: `{"e":1797607104,"d":{"basket":["Sourdough","Sourdough"]},"i":"01cc6eb881544ea8dee07196e6b0caa6"}`.
- express-session's `connect.sid`: `s%3A` and the session id, then its signature. The data stays on the server.

## Two at once (race.sh)

`race.mjs` starts the server itself, adds one loaf (and so makes the session), then sends two more adds at the same
moment with that same cookie, keeps each answer's `Set-Cookie` as it arrives (the last one winning, as a browser does),
and reads the basket: 3 loaves if both adds counted. 20 times, each with a new session. `./race.sh <setup>`:

```
express-session                1 loaf, then 2 at once, 20 times: 12× Your basket: 3 loaves, 8× Your basket: 2 loaves
cookie-session                 1 loaf, then 2 at once, 20 times: 20× Your basket: 2 loaves
Quillo, QUILLO_SECRET set      1 loaf, then 2 at once, 20 times: 20× Your basket: 2 loaves
Quillo, a table                1 loaf, then 2 at once, 20 times: 20× Your basket: 3 loaves
```

- With the session in a cookie (cookie-session, and Quillo), each answer carries a whole new cookie with the basket in
  it, both of them with 2 loaves; the one that arrives last is kept. So one add is lost every time, as Quillo's guide
  says: "Two requests that set the session at once lose one's change".
- express-session loses one some of the time: each request reads the session from the store and saves it back. How
  many times in 20 changes from run to run (8 in 20 in the run above, 12 in 20 in an earlier one).
- With the basket in a table, each add is its own insert: 3 loaves, 20 times in 20, and the basket is kept through a
  restart (above). The cookie holds only the basket's id.
