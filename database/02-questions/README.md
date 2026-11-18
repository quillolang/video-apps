# Asking Questions: SELECT, WHERE, ORDER BY, LIMIT (and NULL) | Quillo Databases #2

Lesson 2 of Quillo Databases: asking questions. select names the columns, where keeps the rows a condition is true of, order by sorts them and limit keeps the first few; null is found with is null, never = null. Every page shows its question, the SQL, above the database's answer.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: products under $5, under $5 and in stock, and the three cheapest
- [`library`](library): the Library: three more books, Jane Austen's books in order, newest first, and members with no email (is null)
- [`school`](school): the School: year 7 by name, and the youngest student
- [`clinic`](clinic): the Clinic: patients born in 1990 or later, youngest first (the lesson's "your turn")

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

The video's mistake is a version of the Library that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the Library with where email = null, which finds no one (the lesson's mistake)
