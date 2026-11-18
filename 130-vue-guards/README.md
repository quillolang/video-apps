# Vue Router Guards Don't Protect Your API: curl /api/orders, Signed Out (vs Quillo)

Pie Shop: today's orders, for the shop's staff only, in Quillo (main.qwe, on 8080): `routes /admin | signed_in` puts the page and its JSON behind one check on the server, `signed_in` sends anyone else to log in, and the log-in compares the password with `crypto.equal` and sets a signed session. compare/vue is the same shop in Vue 3.5.45 with Vue Router 5.5.1 and Pinia 4.1.0, from the official starter (create-vue, --router --pinia --eslint --bare): a `beforeEach` guard on `meta.requiresAuth`, as Vue Router's docs show it, a Pinia store that remembers signing in in localStorage, and an Express 5.3.0 API, twice: server/api-open.js, whose /api/orders answers anyone, and server/api-checked.js, with a `staffOnly` check of the session cookie. compare/play.mjs uses each in Chromium (signed out, a faked sign-in, a real log-in), compare/curl.sh asks each with curl, signed out; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
STAFF_PASSWORD=apple-pie ./run.sh                                      # Quillo's Pie Shop, on 8080
(cd compare/vue && npm install)
(cd compare/vue && STAFF_PASSWORD=apple-pie node server/api-checked.js) &  # Vue's API, on 3000
(cd compare/vue && npm run dev)                                               # Vue's shop, on 5173
(cd compare && ./curl.sh http://localhost:8080 /admin/orders.json)             # what anyone gets
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
