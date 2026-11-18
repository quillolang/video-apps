# Sessions, Express and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 23:09:03 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
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

## A restart (restart.sh)

`restart.mjs` starts the server itself, adds two loaves (two POSTs to `/add`), reads the basket, stops the server it
started (only that one), starts it again, and reads the basket with the same cookie. `./restart.sh <setup>` runs it for
each of the four:

```
express-session                before the restart: Your basket: 2 loaves; after: Your basket: 0 loaves
cookie-session                 before the restart: Your basket: 2 loaves; after: Your basket: 2 loaves
Quillo                         before the restart: Your basket: 2 loaves; after: Your basket: 0 loaves
Quillo, QUILLO_SECRET set      before the restart: Your basket: 2 loaves; after: Your basket: 2 loaves
```

- express-session answers each POST with 302, Quillo with 303.
- express-session's MemoryStore keeps the sessions in the server's memory, so a restart loses them; the cookie
  (`connect.sid`, 88 characters) is only the session's signed id.
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
- Quillo's, the part before the `.`: `{"e":1797606552,"d":{"basket":["Sourdough","Sourdough"]},"i":"fc52e76db3ef271015ad3f9646ebd518"}`.
- express-session's `connect.sid`: `s%3A` and the session id, then its signature. The data stays on the server.
