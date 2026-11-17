# One Webhook, Six Routes: Payload Routing in Quillo (a Pizza Shop's Kitchen)

Pizza Forno's webhook: a delivery app sends every event to POST /hooks, and six routes on that one path take them apart by their JSON: orders placed, cancelled, couriers, reviews (and reviews that aren't), and a catch-all for the rest. A kitchen board shows the tickets.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
