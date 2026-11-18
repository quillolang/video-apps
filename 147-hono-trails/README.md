# Typed Routes in Hono vs Quillo: /trails/:id{[0-9]+} Gets It Nearly Right

Trail Guide: a page for each of six trails at /trails/<its number>, in Quillo (main.qwe, on 8080): `route GET /trails/:id(int)` matches only a plain whole number, a missing trail answers 404 with a page of its own, and a last `route GET /*rest` is the 404 page for every other address. compare/hono is the same site in Hono 4.13.19 on Bun 1.4.3, from create-hono's bun template: hono/jsx views and the route `/trails/:id{[0-9]+}`. compare/status.sh asks six addresses with curl; shots.mjs also runs a copy with the pattern `{[1-9][0-9]*}`; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Trail Guide, on 8080
(cd compare/hono && bun install && bun run src/index.tsx)   # Hono's, on 8090
(cd compare && ./status.sh http://localhost:8090 && ./status.sh http://localhost:8080)
# Windows (PowerShell), with Quillo from quillolang.org and Bun from bun.sh: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
