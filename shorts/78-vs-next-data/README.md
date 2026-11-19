# A page from a database: Next.js 16 vs Quillo, and the page that didn't update

A page from a table, in Quillo: a route that reads the trails from SQLite on each request, and the migration that makes the table. The Short sets it next to a Next.js server component, which next build prerendered.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
