# No async/await in Quillo: Waiting Without the Ceremony

A pizza tracker waiting on slow kitchens with no async and no await: calls one after another, parallel() to overlap their waits, a server that answers other requests meanwhile, and a page whose click handler waits three times without freezing.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
