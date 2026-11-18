# /trails/abc: What React Router Shows, What the Server Says, and Quillo's Typed Routes

Trail Guide: a page for each of six trails at /trails/<its number>, in Quillo (main.qwe, on 8080): `route GET /trails/:id(int)` matches only a whole number, a missing trail answers 404 with a page of its own, and a last `route GET /*rest` is the 404 page for every other address. compare/react is the same site in React 19.3.1 with React Router 8.5.1, from Vite's starter, two ways (variants/: naive.jsx, useParams and find; loader.jsx, a loader that throws a 404 and an errorElement). compare/visit.mjs opens six addresses in each in Chromium, compare/status.sh asks each with curl; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Trail Guide, on 8080
(cd compare/react && npm install && npm run dev)   # React's (App.jsx is naive.jsx)
(cd compare && ./status.sh http://localhost:8080)  # each address's status
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
#   and cd compare\react; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
