# Sessions in Express vs Quillo: MemoryStore, a Restart, and the Empty Basket

The bakery's basket, kept in a session, in Quillo (main.qwe, on 8080): `session()` and `set_session`, a signed cookie. Run it with QUILLO_SECRET set, or every restart signs everyone out. compare/express is the same basket in Express 5.3.0: app.js with express-session 1.19.0 (its MemoryStore), and variants/cookie.js with cookie-session 2.1.1. compare/restart.sh adds two loaves, restarts the server, and asks again; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
QUILLO_SECRET=$(openssl rand -hex 32) ./run.sh   # Quillo's basket, on 8080
(cd compare/express && npm install && SESSION_SECRET=... node app.js)   # Express's, on 8090
(cd compare && ./restart.sh express-session && ./restart.sh quillo-secret)
# Windows (PowerShell), with Quillo from quillolang.org: $env:QUILLO_SECRET = '...'; quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
