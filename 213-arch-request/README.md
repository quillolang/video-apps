# A Request's Journey: Event Loops, Coroutines and 64 Workers in Quillo

The routes from "A Request's Journey", video 2 of Quillo's system architecture series: one that answers at once, one that sleeps, one that only computes, one that calls a slow API, a shared counter read and written three ways, and two routes on one path.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
