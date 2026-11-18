# Three holes in a login: Express and Quillo, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 16:39:22 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **oidc-provider:** 9.15.0; **Express:** 5.3.0; **express-session:** 1.19.0; **openid-client:** 6.9.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The sites

- **The provider** (`idp/provider.mjs`): video 134's (development login page, no consent page for the club's sites).
- **Express**: `express/variants/naive.js`, the first try: `buildAuthorizationUrl` with no PKCE, nonce or state,
  `authorizationCodeGrant` with no checks, `?next=` kept in the session and followed as it is, and the same session
  after the login. `express/app.js`: a PKCE verifier and challenge and a nonce kept in the session (as openid-client's
  README starts), the callback refused (400) without this browser's verifier or when the grant fails its checks, a
  `local()` check of `?next=` (a path, not `//` or another address), and `req.session.regenerate` once logged in.
- **Quillo**: `../steps/naive/main.qwe`, the first try: no state, `?next=` kept and followed with `redirect(next)`.
  `../app/main.qwe`: `state = crypto.token()` kept in the session and sent to the provider, the callback refused
  (400) unless `crypto.equal(state, session().state)`, and `local_path(next) ?? "/"`. Quillo's session is a signed
  cookie, which `set_session` replaces at the login. `quillo check` prints `main.qwe: ok (3 routes, 1 function, 0 components)` (the first try: no
  warning about the missing state or `redirect(next)`) and `main.qwe: ok (3 routes, 1 function, 0 components)`.

## Three attacks (holes.mjs)

shots.mjs runs the provider and each site on its own host (Express on trail.localhost:3000, Quillo on
trail.localhost:8080), the first tries then the fixed ones. `holes.mjs` uses an attacker (Mallory) and a victim (Ana),
each in a fresh Chromium browser; the stand-in for another site is a page it serves on evil.localhost:7777 (Chrome
refuses ports 6665 to 6669). Login CSRF: Mallory's login is done with her browser's own HTTP client, each redirect
followed by hand, up to the site's callback address, which she keeps instead of opening; Ana's browser opens it. Open
redirect: Ana opens `/login?next=http://evil.localhost:7777/` and logs in. Planted cookie: Mallory opens `/login` (her
requests to the provider are stopped, she only wants the cookie), and her session cookie is set in Ana's browser with
`document.cookie`; Ana logs in; Mallory opens the site with her cookie. Each table is the output of its own command,
`node holes.mjs <name>=http://trail.localhost:<port>`.

### The first tries

```
naive_express:
  csrf      Ana opens Mallory's callback (?code&iss): Trail Club: hello, Mallory
            then the site's home page says: Trail Club: hello, Mallory
  redirect  Ana logs in from /login?next=http://evil.localhost:7777/ and ends on evil.localhost:7777/ (Evil Example)
  fixation  Mallory plants her connect.sid in Ana's browser (taken); Ana sees "Trail Club: hello, Ana"
            and Mallory, with that cookie, sees: Trail Club: hello, Ana
```

```
naive_quillo:
  csrf      Ana opens Mallory's callback (?code&iss): Trail Club: hello, Mallory
            then the site's home page says: Trail Club: hello, Mallory
  redirect  Ana logs in from /login?next=http://evil.localhost:7777/ and ends on evil.localhost:7777/ (Evil Example)
  fixation  Mallory plants her __Host-quillo_session in Ana's browser (taken); Ana sees "Trail Club: hello, Ana"
            and Mallory, with that cookie, sees: Trail Club
```

### Fixed

```
fixed_express:
  csrf      Ana opens Mallory's callback (?code&iss): This login wasn't started here
            then the site's home page says: Trail Club
  redirect  Ana logs in from /login?next=http://evil.localhost:7777/ and ends on trail.localhost:3000/ (Trail Club: hello, Ana)
  fixation  Mallory plants her connect.sid in Ana's browser (taken); Ana sees "Trail Club: hello, Ana"
            and Mallory, with that cookie, sees: Trail Club
```

```
fixed_quillo:
  csrf      Ana opens Mallory's callback (?code&state&iss): This login wasn't started here
            then the site's home page says: Trail Club
  redirect  Ana logs in from /login?next=http://evil.localhost:7777/ and ends on trail.localhost:8080/ (Trail Club: hello, Ana)
  fixation  Mallory plants her __Host-quillo_session in Ana's browser (taken); Ana sees "Trail Club: hello, Ana"
            and Mallory, with that cookie, sees: Trail Club
```

(While the scripts were being written, one run of the first-try Quillo site answered Ana's callback with a 500 once;
five later runs, these included, answered 303 and signed Ana in as Mallory.)
