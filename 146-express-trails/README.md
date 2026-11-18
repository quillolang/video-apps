# Typed Routes in Express vs Quillo: req.params.id Is Text (a 500, a Stack Trace, and /trails/0x2)

Trail Guide: a page for each of six trails at /trails/<its number>, in Quillo (main.qwe, on 8080): `route GET /trails/:id(int)` matches only a plain whole number, a missing trail answers 404 with a page of its own, and a last `route GET /*rest` is the 404 page for every other address. compare/express is the same site in Express 5.3.0 with EJS views: app.js, which tests the id's text and has a 404 handler, and variants/naive.js, the first try (`trails.find((t) => t.id == req.params.id)` and no check), and variants/pattern.js, a pattern in the path that Express 5 refuses. compare/status.sh asks six addresses with curl; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Trail Guide, on 8080
(cd compare/express && npm install && node app.js)   # Express's, on 8090
(cd compare && ./status.sh http://localhost:8090 && ./status.sh http://localhost:8080)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe; cd compare\express; npm install; node app.js
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
