# Routes and Route Groups in Quillo: Params, Prefixes and Middleware

A little bookshop: pages found by typed routes, a JSON API in a routes group with a nested group inside, and an admin area behind middleware that sends you to log in first.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): routes: a typed parameter, the route after it, 404 and 405
- [`steps/v2`](steps/v2): a routes /api group, a query pattern, and a group inside it
- this folder: a routes /admin group with signed_in middleware, and logging in
