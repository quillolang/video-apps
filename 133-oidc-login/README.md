# Log In with OpenID Connect: Express and openid-client vs Quillo, by Hand

Trail Club: log in with the club's OpenID Connect provider, in Quillo (main.qwe, on 8080), by hand with built-ins: discovery with `http.get`, a `state` from `crypto.token()` kept in the session, the code traded for tokens with `http.post` (client_secret_post), and the user from the provider's userinfo endpoint. steps/unchecked is the version before quillo check's two warnings were heeded. compare/idp is the provider (oidc-provider 9.15.0, its development login page, on 4000); compare/express is the same site in Express 5.3.0 with express-session and openid-client 6.9.0 (PKCE, a nonce, the ID token checked). compare/login.mjs logs in through each in Chromium and records its page requests; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs) &                 # the provider, on 4000
CLIENT_SECRET=quillo-app-secret ./run.sh                                 # Quillo's Trail Club, on 8080
(cd compare/express && npm install && CLIENT_SECRET=express-app-secret SESSION_SECRET=dev node app.js)   # Express's, on 3000
# Windows (PowerShell), with Quillo from quillolang.org: $env:CLIENT_SECRET='quillo-app-secret'; quillo run main.qwe
#   and the provider: cd compare\idp; npm install; node provider.mjs
```

## The versions in the video

The first version from the video, a folder that runs on its own (`cd steps/unchecked && CLIENT_SECRET=quillo-app-secret ./run.sh`):

- [`steps/unchecked`](steps/unchecked): the version before quillo check's two warnings were heeded: http.post and http.get to an address from a value, without saying the provider is meant to be reached inside
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
