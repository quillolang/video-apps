# Sign In Once, Two Apps: Single Sign-On and the localhost Cookie Trap (Express vs Quillo)

The trail club's two sites, Trail Club and Photo Album, signing in once with the club's OpenID Connect provider, in Quillo (main.qwe, one file for both sites: its name, client and address from the environment), each on a host of its own (trail.localhost:8080, photos.localhost:8081). compare/idp is the provider (oidc-provider 9.15.0, four clients, no consent page for the club's own sites); compare/express is the same two sites in Express with openid-client (3000, 3001). compare/sso.mjs signs in to both in one browser; compare/trap.mjs shows two sites on plain localhost sharing one cookie jar; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install && node provider.mjs) &        # the provider, on 4000
SITE='Trail Club' CLIENT_ID=trail-quillo CLIENT_SECRET=trail-quillo-secret BASE=http://trail.localhost:8080 ./run.sh &
SITE='Photo Album' CLIENT_ID=photos-quillo CLIENT_SECRET=photos-quillo-secret BASE=http://photos.localhost:8081 ./run.sh --port 8081
# Windows (PowerShell), with Quillo from quillolang.org: set the same variables with $env:NAME='...', then quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
