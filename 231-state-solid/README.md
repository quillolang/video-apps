# Quillo vs Solid: Where State Lives (Fixing the Push That Broke With Two Servers)

The page from "Quillo vs Solid: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Solid 2.0 with an Express 5 server (compare/solid: a signal, Solid Router 2's useSearchParams, express-session, a server variable, node:sqlite, and server-sent events from a server that watches the database, so the push works with several processes).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
