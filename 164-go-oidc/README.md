# Log In with OpenID Connect: Go (go-oidc, x/oauth2) vs Quillo, by Hand

Trail Club logs in with the club's OpenID Connect provider (compare/idp, oidc-provider 9.15.0), in Quillo by hand (main.qwe, on trail.localhost:8080, video 159's). compare/go is the same site in Go 1.27.4 with coreos/go-oidc v3.21.0 and golang.org/x/oauth2 v0.38.0 (main.go, on trail.localhost:8092): a state, a nonce and a PKCE verifier in short-lived cookies, the code exchanged, the ID token verified, the user from the userinfo endpoint, and sessions in memory. compare/login.sh logs in through both and lists every page request; compare/holes.sh tries a login CSRF, an open redirect and a planted session cookie on both; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs &)   # the provider, on 4000
CLIENT_SECRET=trail-quillo-secret ./run.sh   # Quillo's Trail Club: http://trail.localhost:8080
(cd compare/go && CLIENT_SECRET=trail-go-secret go run .)   # Go's: http://trail.localhost:8092
(cd compare && ./login.sh && ./holes.sh)
# Windows (PowerShell), with Quillo from quillolang.org: $env:CLIENT_SECRET = 'trail-quillo-secret'; quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
