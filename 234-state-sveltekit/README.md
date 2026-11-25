# Quillo vs SvelteKit: Where State Lives (Remote Functions, query.live, Forms Without JavaScript)

The page from "Quillo vs SvelteKit: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in SvelteKit 3.4.0 with adapter-node (compare/sveltekit: $state, page.url's search params, a random visitor id in a cookie with the count in SQLite, a server variable, node:sqlite through remote forms, and query.live).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
