# Three Holes in a Login: Login CSRF, an Open Redirect, a Planted Cookie (Express vs Quillo)

Trail Club's login with the club's OpenID Connect provider, in Quillo (main.qwe, on trail.localhost:8080), with three holes closed: a fresh state for each login (crypto.token, crypto.equal), ?next= only on this site (local_path), and the session's signed cookie, which a planted cookie can't carry into. steps/naive is the first try, with two of the holes. compare/idp is the provider (oidc-provider); compare/express is the same site in Express with openid-client 6.9.0 (variants/naive.js: no PKCE, nonce or state, any ?next=, the session kept; app.js: PKCE and a nonce, a local ?next=, req.session.regenerate). compare/holes.mjs tries login CSRF, an open redirect and a planted session cookie on each, with an attacker and a victim in browsers of their own; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs) &        # the provider, on 4000
CLIENT_ID=trail-quillo CLIENT_SECRET=trail-quillo-secret ./run.sh   # Quillo's Trail Club: http://trail.localhost:8080
(cd compare/express && npm install && CLIENT_ID=trail-express CLIENT_SECRET=trail-express-secret SESSION_SECRET=dev node app.js)
# Windows (PowerShell), with Quillo from quillolang.org: $env:CLIENT_ID='trail-quillo'; $env:CLIENT_SECRET='trail-quillo-secret'; quillo run main.qwe
```

## The versions in the video

The first try from the video, a folder that runs on its own (`cd steps/naive && CLIENT_ID=trail-quillo CLIENT_SECRET=trail-quillo-secret ./run.sh`):

- [`steps/naive`](steps/naive): the first try: no state, and any ?next= followed; login CSRF and the open redirect both work on it
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
