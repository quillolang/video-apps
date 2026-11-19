# All or Nothing: Transactions, Rollback and Savepoints | Quillo Databases #11

Lesson 11 of Quillo Databases: all or nothing. A bank transfer is two writes, money out and money in: with no transaction, a transfer to an account that isn't there takes the money and puts it nowhere (12300 cents in the bank, then 7300). In db.transaction, an error value from inside (a `?`, or `return err(...)`) rolls everything back, and a function that finishes commits. A transaction inside a transaction is a savepoint: the Concert Hall books a group's seats each in one of its own, so a taken seat is left out and the payment goes in with the rest. A dropped inner error still rolls back the outer one: take the inner result with let.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`bank`](bank): the Bank: /transfer in one db.transaction, which rolls back a transfer to no such account
- [`concert`](concert): the Concert Hall: payments (003_payments.sql), and /book-many, each seat a savepoint, the payment with them; /payments
- [`school`](school): the School: seats_left (006_class_seats.sql) and /enroll, the enrollment and its seat in one transaction; /seats (the lesson's "your turn")
- [`shop`](shop): the Corner Shop, as lesson 9 left it
- [`library`](library): the Library, as lesson 10 left it
- [`clinic`](clinic): the Clinic, as lesson 10 left it

```sh
cd bank
./run.sh --watch
```

Then open http://127.0.0.1:8080. One setting at a time on that port: stop one with Ctrl+C before starting the next, or give it `--port 8081`.

On Windows, in PowerShell, in a setting's folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

One version from the video runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the Bank's transfer as two writes with no transaction: a transfer to an account that isn't there loses the money (the lesson's mistake)
