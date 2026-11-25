# Quillo vs Phoenix LiveView: Where State Lives (Processes, Sessions, PubSub)

The page from "Quillo vs Phoenix LiveView: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Phoenix 1.8.17 with LiveView 1.2.15 (compare/phoenix: an assign in the tab's process, handle_params, the signed cookie session written by a controller, an Agent, Ecto with SQLite, and Phoenix.PubSub).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
