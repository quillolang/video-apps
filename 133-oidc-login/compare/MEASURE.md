# OpenID Connect login: Express and openid-client vs Quillo by hand, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 15:36:16 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **oidc-provider:** 9.15.0; **Express:** 5.3.0; **express-session:** 1.19.0; **openid-client:** 6.9.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The provider and the apps

- **The provider** (`idp/provider.mjs`): `npm install oidc-provider`, on http://localhost:4000, with its development-only
  login page (it takes any login and password) and consent page, its in-memory store and development keys, as it warns
  at start. Two clients: `express-app` (client_secret_basic, redirect http://localhost:3000/callback) and `quillo-app`
  (client_secret_post, redirect http://localhost:8080/callback). An account is whoever logs in, its name capitalized.
- **Express** (`express/app.js`): `npm install express express-session openid-client`. openid-client's `discovery`
  (with `allowInsecureRequests`, as the provider is plain http on this machine), `/login` with a PKCE verifier and
  challenge and a nonce kept in the session (as openid-client's README starts, PKCE in place of state), `/callback` with
  `authorizationCodeGrant` (the PKCE verifier, the nonce and the ID token checked) and `fetchUserInfo`, then
  `req.session.regenerate`. 76 packages in node_modules (`npm ls --all --parseable`).
- **Quillo** (`../app/main.qwe`): discovery with `http.get`, `/login` with `state = crypto.token()` kept in the session,
  `/callback` comparing the state with `crypto.equal`, the code traded at the token endpoint with `http.post`
  (client_secret_post, form-encoded), and the user from the userinfo endpoint with `http.get`. Quillo 0.8.6 has no
  OpenID Connect built in (quillolang.org/plugins lists oidc.qwer, a Rust plugin, not used here); with only its built-ins
  it can't make a PKCE S256 challenge (no base64 of a digest) or read the ID token, so it does neither.
  `quillo check` prints `main.qwe: ok (3 routes, 1 function, 0 components)`. `../steps/unchecked/main.qwe` is the version before quillo check's warnings
  were heeded; `quillo check` printed:

```
main.qwe:30: warning: the host `http.post` goes to comes from a value: if a visitor can choose it, they can reach this server's own network (localhost, a cloud's metadata service). Pass { public_only: true } as its options (or public_only: false, when it is meant to reach inside)
main.qwe:35: warning: the host `http.get` goes to comes from a value: if a visitor can choose it, they can reach this server's own network (localhost, a cloud's metadata service). Pass { public_only: true } as its options (or public_only: false, when it is meant to reach inside)
main.qwe: ok (3 routes, 1 function, 0 components), 2 warnings
```

Non-blank lines: express/app.js 44, main.qwe 34.

## One login each (login.mjs)

shots.mjs runs the provider, `CLIENT_SECRET=express-app-secret SESSION_SECRET=videos-only node app.js` (3000) and
`CLIENT_SECRET=quillo-app-secret quillo run main.qwe --port 8080`. `login.mjs` logs in through each in a fresh Chromium
browser: the app's page, Log in, the provider's login page (login "ana", any password), its consent page (Continue),
and back. It records every page request (method, address, status, where a redirect points, and of each address's
parameters those that keep a login safe). Each table is the output of its own command:

`node login.mjs express=http://localhost:3000 > login.json`

```
express: 10 page requests, 835 ms
  GET  localhost:3000/login             302 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/zvHdji…  with code_challenge, nonce
  GET  localhost:4000/interaction/zvHdji… 200
  POST localhost:4000/interaction/zvHdji… 303 → localhost:4000/auth/zvHdji…
  GET  localhost:4000/auth/zvHdji…      303 → localhost:4000/interaction/7Aophy…
  GET  localhost:4000/interaction/7Aophy… 200
  POST localhost:4000/interaction/7Aophy… 303 → localhost:4000/auth/7Aophy…
  GET  localhost:4000/auth/7Aophy…      303 → localhost:3000/callback
  GET  localhost:3000/callback          302 → localhost:3000/  with code
  GET  localhost:3000/                  200
```

`node login.mjs quillo=http://localhost:8080 > login.json`

```
quillo: 10 page requests, 813 ms
  GET  localhost:8080/login             303 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/9UWIlb…  with state
  GET  localhost:4000/interaction/9UWIlb… 200
  POST localhost:4000/interaction/9UWIlb… 303 → localhost:4000/auth/9UWIlb…
  GET  localhost:4000/auth/9UWIlb…      303 → localhost:4000/interaction/DMgsmT…
  GET  localhost:4000/interaction/DMgsmT… 200
  POST localhost:4000/interaction/DMgsmT… 303 → localhost:4000/auth/DMgsmT…
  GET  localhost:4000/auth/DMgsmT…      303 → localhost:8080/callback
  GET  localhost:8080/callback          303 → localhost:8080/  with code, state
  GET  localhost:8080/                  200
```

Both ended on "Hello, Ana" / "Signed in as ana.". Quillo's own log prints each request's address,
the callback's code and state included (the code is single-use and is traded at once).
