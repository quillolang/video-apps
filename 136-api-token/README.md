# An API That Checks the Token: A Revoked JWT Still Gets In (Express and jose vs Quillo)

The trail club's trails API, in Quillo (main.qwe, on 5101): it takes opaque access tokens and, on each call, asks the provider's introspection endpoint about the token (with the API's own client id and secret) whether it's live and for this API. compare/idp is the club's OpenID Connect provider (oidc-provider 9.15.0: client credentials, resource indicators, introspection and revocation; API tokens live 8 seconds here); compare/express is the same API in Express, taking signed JWT access tokens and checking them itself with jose 6.2.17 and the provider's public keys. compare/calls.mjs calls both the same six ways: no token, a good one, one for another API, a forged one, a revoked one and an expired one; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs) &        # the provider, on 4000
API_SECRET=trails-api-quillo-secret ./run.sh --port 5101 &   # Quillo's API
(cd compare/express && npm install && node api.js) &         # Express's API, on 5100
(cd compare && node calls.mjs express=http://localhost:5100 quillo=http://localhost:5101 > calls.json)
# Windows (PowerShell), with Quillo from quillolang.org: $env:API_SECRET='trails-api-quillo-secret'; quillo run main.qwe --port 5101
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
