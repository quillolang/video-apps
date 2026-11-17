# Double-Click, Double Charge: Payments That Run Exactly Once

Bean There, a coffee shop's Pay button, written twice. In plain Node (node/server.mjs) every POST is a charge: a double-click charges twice, and with a slow card network (SLOW=1) the page's own retry after a second charges twice too, and still says something went wrong. In Quillo, steps/v1's server fn charges once per call, so a double-click is two charges there as well. The app wraps the payment in idempotent(): the page sends a key with each payment, two clicks are one call, a call whose answer got lost is sent again with its key and runs once, and other clients can send an Idempotency-Key header.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081 (SLOW=1 for a slow card network)
curl -s localhost:8080/charges
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): pay() as a plain server fn: a charge for each call
- this folder: pay() wrapped in idempotent(): each payment runs once
