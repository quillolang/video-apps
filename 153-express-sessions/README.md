# Sessions in Express vs Quillo: MemoryStore, a Restart, and the Empty Basket

The bakery's basket, kept in a session, in Quillo (main.qwe, on 8080): `session()` and `set_session`, a signed cookie. Run it with QUILLO_SECRET set, or every restart signs everyone out. compare/express is the same basket in Express 5.3.0: app.js with express-session 1.19.0 (its MemoryStore), and variants/cookie.js with cookie-session 2.1.1. compare/restart.sh adds two loaves, restarts the server, and asks again. steps/table keeps the basket in a table instead, as Quillo's guide says (the session holds only the basket's id), and compare/race.sh adds two loaves at the same moment, 20 times. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
QUILLO_SECRET=$(openssl rand -hex 32) ./run.sh   # Quillo's basket, on 8080
(cd compare/express && npm install && SESSION_SECRET=... node app.js)   # Express's, on 8090
(cd compare && ./restart.sh express-session && ./restart.sh quillo-secret && ./race.sh quillo-table)
# Windows (PowerShell), with Quillo from quillolang.org: $env:QUILLO_SECRET = '...'; quillo run main.qwe
```

## The versions in the video

The video ends with a second version, the basket kept the way Quillo's guide says to keep a cart. It runs on its own too (`cd steps/table && QUILLO_SECRET=... ./run.sh`):

- [`steps/table`](steps/table): the basket in a table (migrations/001_loaves.sql), with only its id in the session: two adds at once both count
- this folder: the basket in the session, as the video starts

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
