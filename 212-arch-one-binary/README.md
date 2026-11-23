# One Binary, One Command: What Happens When You Type quillo run

The app from "One Binary, One Command", video 1 of Quillo's system architecture series: a page, a heart button that runs in the browser, and a count kept in SQLite, all in one 29-line main.qwe served by one quillo binary.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
