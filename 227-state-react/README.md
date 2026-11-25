# Quillo vs React: Where State Lives (Tabs, URLs, Sessions, Server, Database, Sync)

The page from "Quillo vs React: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in React 19.3 with an Express 5 server (compare/react: useState, React Router's useSearchParams, express-session, a server variable, node:sqlite, TanStack Query polling).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
