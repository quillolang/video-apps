# The Money Left One Database and Never Arrived (One Transaction Across Two)

Luigi's gift cards: Ada's card in the shop's SQLite (shop.db), and every payment in the ledger, on PostgreSQL (LEDGER_URL in .env; .env.example has one). POST /pay/Ada takes $50 off the card and puts it in the ledger. In plain Node (node/server.mjs, node:sqlite and pg), the two writes commit one by one: with the ledger down, the card's $50 is gone and the ledger never gets it. In Quillo (main.qwe), db.atomic([db, ledger], ...) makes them one transaction over both databases, in two phases: both, or neither. The ledger's PostgreSQL needs max_prepared_transactions above 0.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
cp .env.example .env      # the ledger: a PostgreSQL with max_prepared_transactions = 10, on 5433
./run.sh                  # Quillo, on 8080
(cd node && npm install) && node --env-file=.env node/server.mjs   # Node, on 8081
curl -s -X POST localhost:8080/pay/Ada
```
