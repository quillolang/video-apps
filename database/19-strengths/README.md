# $5 of Credit, Two Payments, -$4: PostgreSQL jsonb, Arrays, Serializable | Quillo Databases #19

Lesson 19 of Quillo Databases: PostgreSQL's own strengths, on the Corner Shop from lesson 18. 012_details.sql: details as jsonb (Quillo gets a map; details->>'origin' searches it) and tags as text[] (a list; :tag = any(tags)), with a page for each product and one for each tag. Exact numbers: 0.1 + 0.2 is 0.3 on PostgreSQL (numeric), 0.30000000000000004 on SQLite; 013_credit.sql keeps store credit as numeric(8, 2). Paying with credit reads the credit, checks, then takes it: on PostgreSQL's default isolation two payments at once both go through and $5.00 becomes -4.00 (steps/shop-v1); serializable without retries tells one customer "could not serialize access" (steps/shop-v2, the lesson's mistake); retries: 5 runs it again, and the second is told there isn't enough credit (steps/shop-v3). The exercise: tags added with array_append, once.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop on PostgreSQL: details in jsonb, tags in an array, store credit in numeric, and paying with credit safely; tags added from a product's page (the lesson's "your turn")
- [`bank`](bank): the Bank on PostgreSQL, as lesson 18 left it
- [`library`](library): the Library, as lesson 15 left it (SQLite)
- [`clinic`](clinic): the Clinic, as lesson 17 left it (SQLite)
- [`school`](school): the School, as lesson 16 left it (SQLite)
- [`concert`](concert): the Concert Hall, as lesson 11 left it (SQLite)

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

The versions from the video run on their own, each with a .env copied from its .env.example and the shop's database made afresh with createdb:

- [`steps/shop-v1`](steps/shop-v1): paying with credit on PostgreSQL's default isolation: two at once take $5.00 to -4.00
- [`steps/shop-v2`](steps/shop-v2): serializable, without retries (the lesson's mistake): one customer sees the database's error
- [`steps/shop-v3`](steps/shop-v3): retries: 5: the second payment runs again and is refused for lack of credit
