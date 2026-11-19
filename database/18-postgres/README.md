# Moving to PostgreSQL: Why last_id Was null | Quillo Databases #18

Lesson 18 of Quillo Databases: the Corner Shop moves to PostgreSQL. Installed from postgresql.org (Windows too); createdb shop; db.open(env("DATABASE_URL")) | unwrap, the address in .env (copy .env.example; a new install answers on 5432, the video uses 5434). The SQLite migrations fail on PostgreSQL ("syntax error at or near strict", steps/shop-v1), so they get a PostgreSQL version: generated always as identity, date columns with current_date, bigint for the card references (steps/shop-v2); like is lower() on both sides, strftime a date's first seven characters, and the seed works its dates out with date.add_days. The mistake (steps/shop-v2): the sign-up goes on to r.last_id, always null on PostgreSQL, so /customer?id=null; the fix: insert ... returning id with db.one. The exercise: the Bank moved too.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop on PostgreSQL: DATABASE_URL in .env (from .env.example), its migrations for PostgreSQL, and the sign-up with returning id
- [`bank`](bank): the Bank on PostgreSQL (the lesson's "your turn"): its own database, createdb bank
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

The versions from the video run on their own, each with a .env copied from its .env.example and its own database made with createdb:

- [`steps/shop-v1`](steps/shop-v1): the shop opening DATABASE_URL, its SQLite migrations as they were: the first fails on PostgreSQL
- [`steps/shop-v2`](steps/shop-v2): its migrations for PostgreSQL, and a sign-up that goes on by last_id (the lesson's mistake): null on PostgreSQL
