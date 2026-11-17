# This Page Ran 101 Queries. Now It Runs 1

Luigi's orders: /orders shows the latest 100 orders with who placed each one, and /report all 10,000 (1,000 customers, from the migration). The first version (steps/v1) asks for each order's customer in the view, one query per row: 101 queries for /orders, 10,001 for /report. The finished one asks for both at once with a join: one query. stats.sh loads a page and prints its time (the middle of five loads) and each statement with how many times it ran, from Quillo's query stats, on under quillo run --watch. SQLite unless DATABASE_URL names a PostgreSQL.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch           # on 8080, with query stats on
./stats.sh /orders         # its time, and the queries one load ran
./stats.sh /report
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a query for each order's customer, in the view: 101 queries for one page
- this folder: the finished app
