# Prefetching in Quillo: Pages That Open Before You Click

The Museum of Tiny Things: rooms that take 400 ms to put together, and links that open before they're clicked. Quillo fetches a linked page as soon as it's pointed at; a fetch that would change something (the like link) is refused until the real click.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
