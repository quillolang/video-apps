# 10 Cents + 20 Cents = 0.30000000000000004? Money, Dates, Big Numbers | Quillo Databases #13

Lesson 13 of Quillo Databases: money, dates and big numbers. The Library's late fines in a real column add up to 0.30000000000000004, which isn't 0.3; in whole cents, an integer (011_fine_cents.sql, the next migration), the total is exactly 30, shown as $0.30 with money.format(money.from_minor(...)). Dates are text, year first (they sort right; month first doesn't), in UTC. The Corner Shop's card references past 2^53 are exact in SQLite and Quillo, but JavaScript's JSON.parse rounds them, so /orders.json sends them as text. The exercise: a monthly statement, grouped by strftime('%Y-%m', placed), in cents, shown as dollars.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`library`](library): the Library: late fines (010_fines.sql, in a real column) and fine_cents (011_fine_cents.sql); /fines, added in cents, shown as dollars
- [`shop`](shop): the Corner Shop: card references past 2^53 (010_order_refs.sql), /orders.json sending them as text, and /statement (the lesson's "your turn")
- [`clinic`](clinic): the Clinic, as lesson 10 left it: its year-first dates
- [`school`](school): the School, as lesson 11 left it
- [`bank`](bank): the Bank, as lesson 11 left it
- [`concert`](concert): the Concert Hall, as lesson 11 left it

```sh
cd library
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

Two versions from the video run on their own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the Library with fines in a real column: a total of 0.30000000000000004 (the lesson's mistake)
- [`steps/v2`](steps/v2): the Corner Shop with card references, sent as text at /orders.json, before the statement
