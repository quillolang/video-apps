# Your Framework Had a Critical Bug. Would You Know? Next.js Middleware, npm audit and Quillo

Trail Club's admin page, for the video about Next.js's middleware advisory (GHSA-f82v-jwr5-mffw, CVE-2025-29927): app/ in Quillo (a route group runs signed_in before each admin route, and the page checks the session again). compare/next is the Next.js app after the upgrade (Next.js 16.4.6, middleware.js, and an admin page that checks the session too); versions/ holds the app as it was (Next.js 15.2.2's package.json and lockfile, renamed so the repository's scanners don't flag them, and admin.v1.js, the page that trusts the middleware), and compare/run-compare.sh puts them back, then runs npm audit and the upgrades. No attack is included. For updates, see the official sites: https://nextjs.org and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                      # Trail Club in Quillo: http://127.0.0.1:8080/admin

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
