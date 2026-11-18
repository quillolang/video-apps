# An API that checks the token: Express and jose vs Quillo, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 16:23:40 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **oidc-provider:** 9.15.0; **Express:** 5.3.0; **jose:** 6.2.17
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The provider and the APIs

- **The provider** (`idp/provider.mjs`): oidc-provider on http://localhost:4000 with client credentials, introspection,
  revocation and resource indicators. Four APIs, by address: the trails API on 5100 (JWT access tokens) and on 5101
  (opaque ones), and a photos API of each kind (5102, 5103), whose tokens are the right kind for another API. Tokens for
  the APIs live `TTL` seconds, 8 here. Clients: `club-site` (client credentials) and `trails-api-quillo` (for
  introspection). Port 5000 is macOS's AirPlay Receiver, so the APIs are on 5100 and 5101.
- **Express** (`express/api.js`): `npm install express jose` (66 packages in node_modules). `GET /api/trails` reads the
  bearer token and checks it with jose's `jwtVerify` against the provider's keys (`createRemoteJWKSet`): issuer,
  audience `http://localhost:5100`, `typ: at+jwt`, expiry. A failure is a 401 with jose's error code.
- **Quillo** (`../app/main.qwe`): `GET /api/trails` reads the bearer token and posts it to the provider's introspection
  endpoint (`http.post`, with the API's client id and secret); unless the answer is `active` and for
  `http://localhost:5101`, it's a 401. Quillo 0.8.6's built-ins can't check a JWT's signature, so its tokens are opaque.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 0 components)`.

Non-blank lines: api.js 23, main.qwe 18.

## Six calls to each (calls.mjs)

shots.mjs runs the provider, `node api.js` (5100) and `API_SECRET=trails-api-quillo-secret quillo run main.qwe --port 5101`,
then `node calls.mjs express=http://localhost:5100 quillo=http://localhost:5101 > calls.json`. Tokens come from the
provider's token endpoint (client credentials, the API as the resource). The forged token is, for Express, the good JWT
with its payload's `sub` changed to "admin" and the signature kept, and for Quillo 32 random bytes. The revoked token is
a fresh good one, revoked at the provider's revocation endpoint first. The expired one is the good token after
9 seconds. One call is the median of 20 good calls, as the script saw it (it varies from run to run; this
machine was rendering video at the time). Its table:

```
         express (a signed JWT)                                        quillo (opaque)
none     401 a token, please                                           401 a token, please
good     200 6 trails                                                  200 6 trails
other    401 not a valid token (ERR_JWT_CLAIM_VALIDATION_FAILED)       401 not a valid token
forged   401 not a valid token (ERR_JWS_SIGNATURE_VERIFICATION_FAILED) 401 not a valid token
revoked  200 6 trails                                                  401 not a valid token
expired  401 not a valid token (ERR_JWT_EXPIRED)                       401 not a valid token
one call 0.73 ms                                                       1.07 ms
revoking express's token: the provider answered 400 {"error":"unsupported_token_type","error_description":"Structu
revoking quillo's token: the provider answered 200
```
