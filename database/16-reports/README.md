# Group By Gave Me the Wrong Row: Window Functions and CTEs | Quillo Databases #16

Lesson 16 of Quillo Databases: reports, with window functions and named steps (with). The Bank's statement (003_movements.sql, Ada's month): sum(cents) over (order by day, id), a running balance, every row kept. The School (007_more_grades.sql: Ana ties Maya in Math): rank() over (partition by class), shared places; a window in where is an error (misuse of window function), so the top of each class asks a named step. The Corner Shop's latest order per customer with group by (steps/shop-v1, the lesson's mistake) takes an order's id and date from any row of the group: Customer 3's is a year old; row_number() in a named step, number 1 of each, is right. The exercise: orders by month beside the month before, with lag().

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`bank`](bank): the Bank: movements (003_movements.sql) and /statement, a running balance
- [`school`](school): the School: a tie in Math (007_more_grades.sql), /rankings and /top
- [`shop`](shop): the Corner Shop: /latest, each customer's latest order, and /months (the lesson's "your turn")
- [`library`](library): the Library, as lesson 15 left it
- [`clinic`](clinic): the Clinic, as lesson 15 left it
- [`concert`](concert): the Concert Hall, as lesson 11 left it

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

The versions from the video run on their own (`cd steps/shop-v1 && ./run.sh --watch`, then `.quillo/bin/quillo run seed.qwe` in a second terminal):

- [`steps/school-v1`](steps/school-v1): the School with its rankings, before the top of each class
- [`steps/shop-v1`](steps/shop-v1): the latest order per customer with group by (the lesson's mistake): an order's columns from any row of the group
- [`steps/shop-v2`](steps/shop-v2): with row_number() in a named step (where the "your turn" starts)
