# Two Bakeries, One App: a Database per Customer in Quillo

Two bakeries, one app: each bakery is a tenant, picked by the host (crumbs.localhost is the bakery crumbs), with a SQLite database of its own in data/. Run it and open one at http://localhost:8080. The video also runs a version with a global sales counter, to show that a global is one copy for every bakery: keep a bakery's numbers in its database.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
