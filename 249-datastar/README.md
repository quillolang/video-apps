# Quillo vs Datastar (1.0.5, Go): the Same Live List, Measured

A shared shopping list, live in every open tab, in Quillo, and the same app in Datastar 1.0.5 with its Go SDK (compare/datastar). compare/measure.mjs plays both in Chromium and writes compare/runs/; compare/mistakes.mjs makes the same small mistakes in each. For updates, see https://data-star.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.11. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
