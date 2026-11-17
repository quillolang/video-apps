# One Bad Request Took Down My Node Server (and Everyone After It)

Luigi's, a pizza shop's order server, in plain Node and in Quillo. In Node (node/server.mjs), JSON.parse in an async handler throws on a body with a trailing comma; nothing catches it, so the process ends, and every customer after it gets no answer. In Quillo (steps/v1) a body that isn't an Order doesn't match the route: 400, and the server goes on. steps/v2 adds prices with a bug of our own (a pizza with no price, plus delivery): that request gets a 500, its details in the log, and the next one is fine. The app checks for the price first and replies 422.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -sS --json '{"pizza": "funghi",}' localhost:8081/orders
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): orders as a typed JSON body: a bad body is a 400
- [`steps/v2`](steps/v2): prices, with a bug: a pizza we don't make is a 500 for that request
- this folder: no price, no order: a 422 that says so
