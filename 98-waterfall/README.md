# Spinner, Spinner, Spinner: Fix the Fetch Waterfall

Ada's dashboard: who she is, her orders, and picks for her, from three calls of 400 ms each. In plain Node (node/server.mjs) the page arrives with a spinner and its script fetches them one after another, a waterfall. In Quillo the server makes the page with the data already in it: one call after another in the video's first version (steps/v1), and the two that only need Ada's id at once with parallel() in the app. The page is a view: no JavaScript at all.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the page made on the server, the calls one after another
- this folder: the orders and the picks called at once, with parallel()
