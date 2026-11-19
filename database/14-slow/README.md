# Why Is This Query Slow? Read the Plan, Add the Right Index | Quillo Databases #14

Lesson 14 of Quillo Databases: why is this query slow? Each of three settings gets a seed.qwe (sample data for measuring, run once: 100,000 orders, loans or appointments) and stats.qwe, which prints the running program's query stats (on under --watch, or with --query-stats). The Corner Shop's /customer page scans orders (explain query plan: SCAN orders); 011_orders_customer.sql makes it a SEARCH. The Library's /loans-of needs (member_id, due): member_id alone still sorts, (due, member_id) scans. The mistake: /find compares lower(email), which the index on email can't help (SCAN members); 013_members_email_lower.sql indexes lower(email). The exercise: the Clinic's /day, an index on (doctor_id, starts_at).

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: seed.qwe (a thousand customers, 100,000 orders), stats.qwe, /customer?id=7, and 011_orders_customer.sql
- [`library`](library): the Library: seed.qwe (20,000 members, 100,000 loans), stats.qwe, /loans-of?id=7 with 012_loans_member_due.sql, and /find?email=... with 013_members_email_lower.sql
- [`clinic`](clinic): the Clinic: seed.qwe (20 doctors, 2,000 patients, 100,000 appointments), stats.qwe, /day?doctor=2&day=2026-12-02, and 006_appointments_doctor_time.sql (the lesson's "your turn")
- [`school`](school): the School, as lesson 11 left it
- [`bank`](bank): the Bank, as lesson 11 left it
- [`concert`](concert): the Concert Hall, as lesson 11 left it

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

The versions from the video run on their own (`cd steps/shop-v1 && ./run.sh --watch`, then `.quillo/bin/quillo run seed.qwe` in a second terminal):

- [`steps/shop-v1`](steps/shop-v1): the Corner Shop before its index: /customer scans every order
- [`steps/library-v1`](steps/library-v1): the Library before its indexes: /loans-of scans and sorts
- [`steps/library-v2`](steps/library-v2): with 012_loans_member_due.sql, and /find by lower(email), which still scans (the lesson's mistake)
- [`steps/clinic-v1`](steps/clinic-v1): the Clinic before its index: /day scans (where the "your turn" starts)
