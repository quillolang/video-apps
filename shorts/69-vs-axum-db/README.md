# A JSON API from a database: Axum + sqlx vs 4 lines of Quillo

A JSON API that reads a table, in four lines of Quillo: open the database, migrate, and a route whose list comes back as JSON. The Short sets it next to Axum and sqlx.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
