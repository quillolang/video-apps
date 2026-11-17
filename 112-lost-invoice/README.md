# Saved the Order, Lost the Invoice: Calls That Survive a Crash

Luna's Cakes: an order, and its invoice, which takes two seconds to send (a slow mail provider, played by sleep). In plain Node (node/shop.mjs, on 8181) the order is saved and the invoice is sent in the background with no await; kill -9 the server right after twelve orders and the invoices are gone, for good: 12 orders, 0 invoices, even after a restart. In Quillo (main.qwe, on 8180, with billing.qwe as a service in the same process) the order and billing.later.invoice(order.id) are in one db.transaction, so the call is kept in shop.db (_quillo_later) with the order; after the same kill -9 and a restart, all twelve invoices are sent (within a minute or so), and GET /orders/12 shows later.status of its invoice: waiting, then done.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8180          # Quillo, with its billing service
node node/shop.mjs            # Node, on 8181
for i in $(seq 12); do curl -s localhost:8180/order -d cake=lemon; done
kill -9 $(lsof -ti tcp:8180 -sTCP:LISTEN)    # the crash
curl -s localhost:8180/orders/12              # once started again
```
