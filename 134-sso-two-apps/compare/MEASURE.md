# Single sign-on, two sites: Express and Quillo, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 15:51:35 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **oidc-provider:** 9.15.0; **Express:** 5.3.0; **express-session:** 1.19.0; **openid-client:** 6.9.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The provider and the sites

- **The provider** (`idp/provider.mjs`): oidc-provider on http://localhost:4000 with its development login page, four
  clients (trail-express, photos-express, trail-quillo, photos-quillo), each allowed back to its own host
  (trail.localhost, photos.localhost) and to plain localhost on the same port, and a `loadExistingGrant` that grants the
  club's own sites `openid profile` at once (no consent page).
- **Express** (`express/app.js`): the login of video 133 (openid-client, PKCE, a nonce), its site name (`SITE`), client
  (`CLIENT_ID`, `CLIENT_SECRET`) and address (`BASE`) from the environment, run twice (3000, 3001).
- **Quillo** (`../app/main.qwe`): the login of video 133 by hand, its site name, client and address from the environment
  (`env`), run twice (8080, 8081). `quillo check` prints `main.qwe: ok (3 routes, 1 function, 0 components)`.

## Each site on a host of its own (sso.mjs)

One browser signs in to Trail Club (the provider's login page, login "ana"), then clicks Log in on Photo Album, then
opens Trail Club again. Each table is the output of its own command:

`node sso.mjs express=http://trail.localhost:3000,http://photos.localhost:3001 > sso.json`

```
express, Trail Club: asked login; 7 page requests, 1330 ms
  GET  trail.localhost:3000/login         302 → localhost:4000/auth
  GET  localhost:4000/auth                303 → localhost:4000/interaction/27C25r…
  GET  localhost:4000/interaction/27C25r… 200
  POST localhost:4000/interaction/27C25r… 303 → localhost:4000/auth/27C25r…
  GET  localhost:4000/auth/27C25r…        303 → trail.localhost:3000/callback
  GET  trail.localhost:3000/callback      302 → trail.localhost:3000/
  GET  trail.localhost:3000/              200
express, Photo Album: asked nothing; 4 page requests, 576 ms
  GET  photos.localhost:3001/login        302 → localhost:4000/auth
  GET  localhost:4000/auth                303 → photos.localhost:3001/callback
  GET  photos.localhost:3001/callback     302 → photos.localhost:3001/
  GET  photos.localhost:3001/             200
```

`node sso.mjs quillo=http://trail.localhost:8080,http://photos.localhost:8081 > sso.json`

```
quillo, Trail Club: asked login; 7 page requests, 1334 ms
  GET  trail.localhost:8080/login         303 → localhost:4000/auth
  GET  localhost:4000/auth                303 → localhost:4000/interaction/Idivlv…
  GET  localhost:4000/interaction/Idivlv… 200
  POST localhost:4000/interaction/Idivlv… 303 → localhost:4000/auth/Idivlv…
  GET  localhost:4000/auth/Idivlv…        303 → trail.localhost:8080/callback
  GET  trail.localhost:8080/callback      303 → trail.localhost:8080/
  GET  trail.localhost:8080/              200
quillo, Photo Album: asked nothing; 4 page requests, 550 ms
  GET  photos.localhost:8081/login        303 → localhost:4000/auth
  GET  localhost:4000/auth                303 → photos.localhost:8081/callback
  GET  photos.localhost:8081/callback     303 → photos.localhost:8081/
  GET  photos.localhost:8081/             200
```

Trail Club, opened again afterwards: "Trail Club: hello, Ana" (Express), "Trail Club: hello, Ana" (Quillo).

## Both sites on plain localhost (trap.mjs)

The same sites, each started with `BASE=http://localhost:<its port>`. One browser signs in to Trail Club, then to Photo
Album (no password asked), then opens Trail Club again (`node trap.mjs express=http://localhost:3000,http://localhost:3001`,
and the same for Quillo on 8080 and 8081):

| | Trail Club, signed in | Photo Album | Trail Club again | Cookies for localhost |
|---|---|---|---|---|
| Express | Trail Club: hello, Ana | Photo Album: hello, Ana | Trail Club | _interaction, _interaction.sig, _session, _session.sig, connect.sid |
| Quillo | Trail Club: hello, Ana | Photo Album: hello, Ana | Trail Club | _interaction, _interaction.sig, _session, _session.sig, __Host-quillo_session |

Cookies are kept per host, not per port: both sites on localhost wrote a session cookie of the same name, so Photo
Album's replaced Trail Club's. Neither took the other's cookie as its own session (Quillo's is signed by each server).
