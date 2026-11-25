# Quillo vs Svelte: Where State Lives (Runes, WebSockets, and the Smallest Download)

The page from "Quillo vs Svelte: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Svelte 5 with an Express 5 server (compare/svelte: the $state rune, a plain link and URLSearchParams, express-session, a server variable, node:sqlite, and a WebSocket push with ws).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
