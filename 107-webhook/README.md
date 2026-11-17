# Anyone Can Call Your Payment Webhook. Make It Prove Who It Is

Luigi's orders: an order's page, and the webhook a payment provider posts to when an order is paid. In plain Node (node/server.mjs) the webhook believes any post, so a curl from anyone marks an order paid. In Quillo (main.qwe) the provider signs each event (Pay-Signature: t=<time>,v1=<HMAC of time.body>), and the webhook makes the HMAC again with crypto.hmac, compares it with crypto.equal, refuses a time more than five minutes off, and counts each event's id once. pay.sh stands in for the provider, with the made-up secret in .env.example.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
cp .env.example .env      # the shared secret, a made-up one
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -s localhost:8080/hooks/pay --json '{"id":"evt_1","order":42}'   # bad signature
./pay.sh '{"id":"evt_1","order":42}'                                  # received
```
