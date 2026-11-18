# Typed Routes in Go vs Quillo: /trails/{id}, strconv.Atoi, and the Page at Three Addresses

Trail Guide: a page for each of six trails at /trails/<its number>, in Quillo (main.qwe, on 8080): `route GET /trails/:id(int)` matches only a plain whole number, a missing trail answers 404 with a page of its own, and a last `route GET /*rest` is the 404 page for every other address. compare/go is the same site in Go 1.27.4 with only the standard library: net/http's patterns (`GET /trails/{id}`), strconv.Atoi, and html/template. compare/build-variants.sh builds it as it is and two ways more (catch-all, strict); compare/status.sh asks six addresses with curl; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Trail Guide, on 8080
(cd compare/go && go run .)                  # Go's, on 8090
(cd compare && ./status.sh http://localhost:8090 && ./status.sh http://localhost:8080)
# Windows (PowerShell), with Quillo from quillolang.org and Go from go.dev: quillo run main.qwe; cd compare\go; go run .
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
