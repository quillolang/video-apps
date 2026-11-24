# Where State Lives in Quillo: Tabs, URLs, Sessions, Server Memory, Database, Live

The page from "Where State Lives in Quillo": six counters, one for each kind of state (a component's state, the address, the session, a top-level let, the database, and the database read with live()).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
