# This Page Ran 101 Queries, and Page 2 Skipped a Row: N+1 and Paging | Quillo Databases #15

Lesson 15 of Quillo Databases: slow pages, with lesson 14's seeds. The Corner Shop's /recent, the latest hundred orders with their customers' names, first asks for each name on its own (steps/shop-v1): stats.qwe counts 101 queries for 100 rows, each cheap in SQLite, each a round trip on a database server; one join makes it one query. The Library's Books out (/loans) fifty to a page: with offset (steps/library-v1, the lesson's mistake) page 2000 is slower than page 2, and when a loan is deleted while you read page 1, page 2 skips one; starting after the last loan's id (where loans.id > :after) is as quick on every page and skips nothing. The exercise: the Clinic's history, fifty at a time.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: /recent, the latest orders with their customers' names, in one query
- [`library`](library): the Library: /loans, Books out, fifty to a page, after the last loan
- [`clinic`](clinic): the Clinic: /appointments, its history fifty at a time (the lesson's "your turn")
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

- [`steps/shop-v1`](steps/shop-v1): the Corner Shop asking for each customer's name on its own: 101 queries for 100 rows
- [`steps/library-v1`](steps/library-v1): the Library paging with offset (the lesson's mistake): slower on far pages, and a loan skipped when one is deleted
- [`steps/clinic-v1`](steps/clinic-v1): the Clinic sending its whole history (where the "your turn" starts)
