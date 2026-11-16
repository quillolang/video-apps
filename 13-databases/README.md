# Databases in Quillo: Migrations, Queries, Transactions and Live Pages

A team kudos board in SQLite: tables from migrations, queries with ? and :name values, rows checked against a record type, a unique name said plainly with db.error_kind, kudos given in a transaction that's all or nothing, and a board that follows the database live.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
