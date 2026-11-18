# Log Out Everywhere? The Other Site Stayed Signed In (Single Sign-On, Express vs Quillo)

The trail club's two sites, Trail Club and Photo Album, signed in once with the club's OpenID Connect provider, with Log out (this site) and Log out everywhere (this site and the provider, through its end-session page), in Quillo (main.qwe, both sites): each page asks the provider, with the site's access token, whether you're still signed in, since logging out everywhere ends every site's tokens there. steps/v1 is the version without that check, where the other site stayed signed in. compare/idp is the provider (oidc-provider 9.15.0, with back-channel logout for the Express sites); compare/express is the same two sites in Express with openid-client, and a back-channel logout endpoint that checks the provider's logout token with jose 6.2.17 (variants/logout-only.js is the version without it). compare/logout.mjs logs in and out in Chromium; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare/idp && npm install) && (cd compare/express && npm install)
./run-all.sh        # the provider and all four sites, each on a host of its own (trail.localhost, photos.localhost)
# Windows (PowerShell), with Quillo from quillolang.org: start compare\idp's provider.mjs with node, then for each site
#   set SITE, CLIENT_ID, CLIENT_SECRET and BASE with $env:NAME='...' and run quillo run main.qwe --port <its port>
```

## The versions in the video

The first version from the video, a folder that runs on its own (see ../shots-run.sh for the variables each site needs):

- [`steps/v1`](steps/v1): Log out and Log out everywhere, without asking the provider on each page: after logging out everywhere, the other site is still signed in
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
