# Vue Router guards vs Quillo's route group: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 14:12:28 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vue:** 3.22.3; **Vue:** 3.5.45; **Vue Router:** 5.5.1; **Pinia:** 4.1.0; **Vite:** 8.3.8; **Express:** 5.3.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless
- **The staff password:** `STAFF_PASSWORD=apple-pie`, in the environment of both APIs and of Quillo (both refuse every
  log-in when it isn't set)

## The apps

- **Vue** (`vue/`): the official starter, `npm create vue@latest -- --router --pinia --eslint --bare vue`, then
  `npm install` and `npm install express`. The starter's counter store is removed and these are added:
  `src/router/index.js` (home, log in, and `/admin`, loaded when visited and marked `meta: { requiresAuth: true }`; a
  `router.beforeEach` guard that sends a visitor who isn't signed in to `/login?next=...`, as Vue Router's docs show it
  under "Route Meta Fields"), `src/stores/auth.js` (a Pinia store: `signedIn` starts from `localStorage`, and `logIn`
  posts to `/api/login` and stores `signedIn = '1'`), `src/views/` (the home, log-in and orders pages; the orders page
  fetches `/api/orders`), `src/shop.css` (the same file as `../app/shop.css`), and the API, twice:
  `server/api-open.js` (Express: `/api/login` compares the password with `timingSafeEqual` and sets an httpOnly session
  cookie; `/api/orders` answers anyone) and `server/api-checked.js` (the same, with a `staffOnly` check of the session
  cookie on `/api/orders`). `vite.config.js` proxies `/api` to `API` (default `http://localhost:3000`), in dev and in
  `vite preview`. The starter's ESLint: `no problems`.
- **Quillo** (`../app/main.qwe`, with `shop.css` and `orders.json`): `fn signed_in(r)` lets a request through when the
  session has `staff`, else answers 303 to `/login?next=...`; `routes /admin | signed_in` holds the orders page and
  `/admin/orders.json`; the log-in compares the password with `crypto.equal` and calls `set_session({ staff: name })`.
  `quillo check` prints `main.qwe: ok (5 routes, 2 functions, 0 components)`.

Non-blank lines: 
- `compare/vue/src/router/index.js`: 27
- `compare/vue/src/stores/auth.js`: 18
- `compare/vue/src/views/LoginView.vue`: 24
- `compare/vue/src/views/AdminView.vue`: 20
- `compare/vue/server/api-checked.js`: 29
- `app/main.qwe`: 47

The production build (`npx vite build`):

```
dist/index.html 0.42 kB │ gzip: 0.28 kB
dist/assets/index-ELeVLmPx.css 0.98 kB │ gzip: 0.50 kB
dist/assets/AdminView-ehZbiIYV.js 0.74 kB │ gzip: 0.44 kB
dist/assets/index-D3JHP_Kd.js 100.59 kB │ gzip: 39.16 kB
```

## In Chromium (play.mjs)

shots.mjs runs `server/api-open.js` on 3000 and `server/api-checked.js` on 3001, serves the build with `vite preview` on
4175 (to the open API) and 4176 (to the checked one), and Quillo with `quillo run main.qwe` on 8080. `play.mjs` opens
each in a fresh browser three ways: `out`, signed out, at `/admin`; `forged`, signed out but with the sign-in faked (for
Vue, `localStorage.setItem('signedIn', '1')` run in the page, what one line in the browser's console does; for Quillo, a
session cookie whose payload is `{"staff":"mallory"}` with no signature of the server's, sent with every request); and
`staff`, logging in with the right password through the page's form.

### Vue, open API (4175)
| Way | Ends on | Heading | Page | Requests for the orders |
|---|---|---|---|---|
| out | /login?next=/admin | Staff log in | Name / Password | none |
| forged | /admin | Today's orders | # NAME PIE PICKUP / 1041 Mrs. Okafor 2 × Apple 10:30 | 200 /api/orders |
| staff | /admin | Today's orders | # NAME PIE PICKUP / 1041 Mrs. Okafor 2 × Apple 10:30 | 200 /api/orders |

### Vue, checked API (4176)
| Way | Ends on | Heading | Page | Requests for the orders |
|---|---|---|---|---|
| out | /login?next=/admin | Staff log in | Name / Password | none |
| forged | /admin | Today's orders | Couldn't load the orders (401) | 401 /api/orders |
| staff | /admin | Today's orders | # NAME PIE PICKUP / 1041 Mrs. Okafor 2 × Apple 10:30 | 200 /api/orders |

### Quillo (8080)
| Way | Ends on | Heading | Page | Requests for the orders |
|---|---|---|---|---|
| out | /login?next=%2Fadmin | Staff log in | Name / Password | none |
| forged | /login?next=%2Fadmin | Staff log in | Name / Password | none |
| staff | /admin | Today's orders | # NAME PIE PICKUP / 1041 Mrs. Okafor 2 × Apple 10:30 | none |

(Quillo's orders are in the page itself, so it makes no request for them.)

## With curl, signed out (curl.sh)

`./curl.sh http://localhost:4175 /api/orders` (Vue, open API):

```
/admin                          200 
/api/orders                     200 [{"id":1041,"name":"Mrs. Okafor","pie":"Apple","count":2,"pi
/assets/AdminView-ehZbiIYV.js   200, and it asks for /api/orders
```

`./curl.sh http://localhost:4176 /api/orders` (Vue, checked API):

```
/admin                          200 
/api/orders                     401 {"error":"Log in first"}
/assets/AdminView-ehZbiIYV.js   200, and it asks for /api/orders
```

`./curl.sh http://localhost:8080 /admin/orders.json` (Quillo):

```
/admin                          303 http://localhost:8080/login?next=%2Fadmin
/admin/orders.json              303
```

A Quillo session cookie made by hand, before the browser run: logged in as `ana`, the cookie's payload read
`{"e":...,"d":{"staff":"ana"},"i":"..."}`; the same payload with `"mallory"`, with the old signature or none, got a 303
to `/login` for `/admin/orders.json`, and the real cookie a 200.
