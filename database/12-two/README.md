# Two Buyers, One Last Coffee: Race Conditions in SQL | Quillo Databases #12

Lesson 12 of Quillo Databases: two at once. A purchase that checks the stock, takes the card payment (a second), then takes one: two buyers at the same instant both read "1 left", both pay, and the stock goes to -1. The fix takes one first, in one statement that only changes a row with one left (update ... where in_stock > 0), and reads changes: 1, it's yours; 0, sold out. Rules in the table hold for two at once too: unique (show, seat) at the Concert Hall, check (balance_cents >= 0) at the Bank. The exercise: a waiting list when it's sold out.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: purchases (008_purchases.sql, one coffee left), /buy taking one in one statement, and a waiting list (009_waitlist.sql, /waitlist, the lesson's "your turn")
- [`concert`](concert): the Concert Hall, as lesson 11 left it: two at once for one seat, the unique rule decides
- [`bank`](bank): the Bank, as lesson 11 left it: two withdrawals at once, the check decides
- [`school`](school): the School, as lesson 11 left it
- [`library`](library): the Library, as lesson 10 left it
- [`clinic`](clinic): the Clinic, as lesson 10 left it

```sh
cd shop
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

Two versions of the shop from the video run on their own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the purchase as check, pay, take: two buyers at once both get the last coffee (the lesson's mistake)
- [`steps/v2`](steps/v2): take one first, in one statement, and read changes
