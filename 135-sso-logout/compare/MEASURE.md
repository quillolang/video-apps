# Logging out of two sites: Express and Quillo, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 16:12:10 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **oidc-provider:** 9.15.0; **Express:** 5.3.0; **express-session:** 1.19.0; **openid-client:** 6.9.0; **jose:** 6.2.17
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The provider and the sites

- **The provider** (`idp/provider.mjs`): video 134's, with `features.backchannelLogout` on, a `backchannel_logout_uri`
  (and `backchannel_logout_session_required`) for the two Express sites, and its own `fetch` without the dispatcher it
  passes: oidc-provider refuses to send requests to special-use addresses, this machine's among them (its SSRF guard),
  and the sites are on this machine. Without that, the provider logged `fetch failed` for each back-channel notice.
- **Express**: `express/variants/logout-only.js` adds Log out (`req.session.destroy`) and Log out everywhere
  (`client.buildEndSessionUrl` with the ID token as `id_token_hint`, then the provider's end-session page) to video 134's
  site; `express/app.js` adds `POST /backchannel-logout`: the logout token checked with jose's `jwtVerify` against the
  provider's keys (issuer, audience, `typ: logout+jwt`, the back-channel event and a `sid`), then every session in the
  MemoryStore whose user has that `sid` destroyed. `npm install jose`.
- **Quillo**: `../steps/v1/main.qwe` adds Log out (`end_session()`) and Log out everywhere (the provider's end-session
  endpoint, with `id_token_hint`); `../app/main.qwe` keeps the access token in the session and, on each page, asks the
  provider's userinfo endpoint with it: logging out everywhere revokes every grant in the provider's session, so the
  answer is no longer OK, and the site ends its session and goes to `/login`. Quillo's sessions are signed cookies,
  which a server can't end from outside, and 0.8.6's built-ins can't check a signed logout token (no JWT verification).
  `quillo check` prints `main.qwe: ok (5 routes, 1 function, 0 components)` (v1) and `main.qwe: ok (5 routes, 1 function, 0 components)` (with the check).

## Logging out (logout.mjs)

shots.mjs runs the provider and both sites each way, each site on its own host (trail.localhost, photos.localhost),
first the v1 versions, then the fixed ones. `logout.mjs` signs in to both in one browser (the provider's login page for
Trail Club, login "ana"; nothing asked for Photo Album), loads Photo Album five times to time its page, then on Trail
Club clicks Log out, opens Photo Album, logs in to Trail Club again, clicks Log out everywhere (and the provider's
"Yes, sign me out"), opens Photo Album, and logs in to Trail Club again. Each table is the output of its own command,
`node logout.mjs <name>=http://trail.localhost:<port>,http://photos.localhost:<port>`.

### Before the fixes (v1)

```
v1_express:
  trail_in           trail.localhost:3000/          Trail Club: hello, Ana
  photos_in          photos.localhost:3001/         Photo Album: hello, Ana
  trail_out          trail.localhost:3000/          Trail Club
  photos_after_out   photos.localhost:3001/         Photo Album: hello, Ana
  trail_back         trail.localhost:3000/          Trail Club: hello, Ana
  provider_logout    localhost:4000/session/end     Do you want to sign-out from localhost:4000?
  trail_out_all      trail.localhost:3000/          Trail Club
  photos_after_all   photos.localhost:3001/         Photo Album: hello, Ana
  trail_relogin      trail.localhost:3000/          Trail Club: hello, Ana
  Photo Album's page, signed in: 0.5 ms to its first byte (the median of 5)
  logging in again after Log out asked: nothing; after Log out everywhere: login
```

```
v1_quillo:
  trail_in           trail.localhost:8080/          Trail Club: hello, Ana
  photos_in          photos.localhost:8081/         Photo Album: hello, Ana
  trail_out          trail.localhost:8080/          Trail Club
  photos_after_out   photos.localhost:8081/         Photo Album: hello, Ana
  trail_back         trail.localhost:8080/          Trail Club: hello, Ana
  provider_logout    localhost:4000/session/end     Do you want to sign-out from localhost:4000?
  trail_out_all      trail.localhost:8080/          Trail Club
  photos_after_all   photos.localhost:8081/         Photo Album: hello, Ana
  trail_relogin      trail.localhost:8080/          Trail Club: hello, Ana
  Photo Album's page, signed in: 0.2 ms to its first byte (the median of 5)
  logging in again after Log out asked: nothing; after Log out everywhere: login
```

### With the fixes (back-channel logout in Express, a check per page in Quillo)

```
v2_express:
  trail_in           trail.localhost:3000/          Trail Club: hello, Ana
  photos_in          photos.localhost:3001/         Photo Album: hello, Ana
  trail_out          trail.localhost:3000/          Trail Club
  photos_after_out   photos.localhost:3001/         Photo Album: hello, Ana
  trail_back         trail.localhost:3000/          Trail Club: hello, Ana
  provider_logout    localhost:4000/session/end     Do you want to sign-out from localhost:4000?
  trail_out_all      trail.localhost:3000/          Trail Club
  photos_after_all   photos.localhost:3001/         Photo Album
  trail_relogin      trail.localhost:3000/          Trail Club: hello, Ana
  Photo Album's page, signed in: 0.5 ms to its first byte (the median of 5)
  logging in again after Log out asked: nothing; after Log out everywhere: login
```

```
v2_quillo:
  trail_in           trail.localhost:8080/          Trail Club: hello, Ana
  photos_in          photos.localhost:8081/         Photo Album: hello, Ana
  trail_out          trail.localhost:8080/          Trail Club
  photos_after_out   photos.localhost:8081/         Photo Album: hello, Ana
  trail_back         trail.localhost:8080/          Trail Club: hello, Ana
  provider_logout    localhost:4000/session/end     Do you want to sign-out from localhost:4000?
  trail_out_all      trail.localhost:8080/          Trail Club
  photos_after_all   localhost:4000/interaction/db3G0o… Sign-in
  trail_relogin      trail.localhost:8080/          Trail Club: hello, Ana
  Photo Album's page, signed in: 0.8 ms to its first byte (the median of 5)
  logging in again after Log out asked: nothing; after Log out everywhere: login
```

Photo Album's page, signed in, to its first byte (the median of five, in Chromium): Express 0.5 ms
before, 0.5 ms after; Quillo 0.2 ms before, 0.8 ms with the check (a call to the
provider, on this machine).
