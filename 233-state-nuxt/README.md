# Quillo vs Nuxt: Where State Lives (useSession, Server-Sent Events, Nitro Storage)

The page from "Quillo vs Nuxt: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Nuxt 4.7.0 (compare/nuxt: a ref, the route's query, h3's useSession in a sealed cookie, a server variable, node:sqlite through API routes, and server-sent events with createEventStream). compare/nuxt-watch is the same app plus a Nitro plugin that watches a folder, so the push reaches every server process.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
