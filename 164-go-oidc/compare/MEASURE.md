# OpenID Connect login, Go and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Thu Nov 19 2026 01:02:37 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Go:** go version go1.27.4 darwin/arm64; modules (`go list -m all`): cloud.google.com/go/compute/metadata v0.3.0, github.com/coreos/go-oidc/v3 v3.21.0, github.com/go-jose/go-jose/v4 v4.1.4, golang.org/x/oauth2 v0.38.0
- **oidc-provider:** 9.15.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The provider and the sites

- **The provider** (`idp/provider.mjs`, video 159's, with this video's two clients): `npm install oidc-provider`, on
  http://localhost:4000, its development-only login page (any name and password); the club's sites skip the consent page.
  Clients: `trail-go` (client_secret_basic, redirect http://trail.localhost:8092/callback) and `trail-quillo`
  (client_secret_post, redirect http://trail.localhost:8080/callback).
- **Go** (`go/main.go`, 109 non-blank lines; `go mod init trailclub`, `go get github.com/coreos/go-oidc/v3/oidc
  golang.org/x/oauth2`): `oidc.NewProvider` (discovery, at start; `log.Fatal` if it fails), an `oauth2.Config`, a verifier;
  `/login` sets a state, a nonce and a PKCE verifier (`oauth2.GenerateVerifier`) in short-lived cookies and sends the
  provider `AuthCodeURL(state, oidc.Nonce(nonce), oauth2.S256ChallengeOption(pkce))`; `/callback` compares the state,
  exchanges the code with `oauth2.VerifierOption`, verifies the ID token (`verifier.Verify`) and its nonce, asks the
  userinfo endpoint for the name, and keeps the user in an in-memory session under a random id in a cookie. `go vet`:
  ok. Run with `CLIENT_SECRET=trail-go-secret go run .` (8092).
- **Quillo** (`../app/main.qwe`, 39 non-blank lines, video 159's): the login by hand, a fresh `crypto.token()`
  state, and a `?` on reading the provider's settings. `quillo check`: `main.qwe: ok (3 routes, 1 function, 0 components)`.

## One login each (login.sh)

```
go: 7 page requests, 768 ms
  GET  trail.localhost:8092/login       302 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/6_oO1-…  with code_challenge, nonce, state
  GET  localhost:4000/interaction/6_oO1-… 200
  POST localhost:4000/interaction/6_oO1-… 303 → localhost:4000/auth/6_oO1-…
  GET  localhost:4000/auth/6_oO1-…      303 → trail.localhost:8092/callback
  GET  trail.localhost:8092/callback    302 → trail.localhost:8092/  with code, state
  GET  trail.localhost:8092/            200
quillo: 7 page requests, 715 ms
  GET  trail.localhost:8080/login       303 → localhost:4000/auth
  GET  localhost:4000/auth              303 → localhost:4000/interaction/ix1Rfz…  with state
  GET  localhost:4000/interaction/ix1Rfz… 200
  POST localhost:4000/interaction/ix1Rfz… 303 → localhost:4000/auth/ix1Rfz…
  GET  localhost:4000/auth/ix1Rfz…      303 → trail.localhost:8080/callback
  GET  trail.localhost:8080/callback    303 → trail.localhost:8080/  with code, state
  GET  trail.localhost:8080/            200
```

## Three holes (holes.sh)

```
go:
  login CSRF      Ana opens Mallory's callback: "This login wasn't started here"; Ana's home page: "Trail Club"
  open redirect   /login?next=evil.localhost:7777 ends on trail.localhost:8092/
  planted cookie  no session cookie before a login, none to plant; Mallory sees: "Trail Club"
quillo:
  login CSRF      Ana opens Mallory's callback: "This login wasn't started here"; Ana's home page: "Trail Club"
  open redirect   /login?next=evil.localhost:7777 ends on trail.localhost:8080/
  planted cookie  Mallory's __Host-quillo_session, after Ana logs in, shows Mallory: "Trail Club"
```

Go's site sets no session cookie before a login (only the state, nonce and PKCE cookies), so Mallory has none to plant.

## The provider down, at start

With the provider stopped, in a copy shown as `~/club`:

```
~/club/go $ CLIENT_SECRET=trail-go-secret go run .
2026/11/19 01:02:51 Get "http://localhost:4000/.well-known/openid-configuration": dial tcp [::1]:4000: connect: connection refused
exit status 1
~/club/quillo $ CLIENT_SECRET=trail-quillo-secret quillo run main.qwe
quillo: main.qwe: main.qwe:6: http: http://localhost:4000/.well-known/openid-configuration: Connection Failed: Connect error: Connection refused (os error 61)
```
