# Split a Quillo App into Services: Signed Calls, Retries and Circuit Breakers

The shop from "Services", in Quillo's system architecture series: main.qwe sells a mug and bills through billing.qwe, a service. Run it in one process (quillo run main.qwe) or split (--split, --scale billing=3, or billing on its own with --as-service and --service-url).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
