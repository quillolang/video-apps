# Request and Response in Quillo: What Comes In, What Goes Out

Snippets, a tiny API: one route that echoes what a request holds, and routes that answer with text, HTML, JSON with an etag (and a 304), 201 with a location, 204, a 301 redirect, and an error value's 500.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
