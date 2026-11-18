# Your First Table: Rows, Columns and Types | Quillo Databases #1

Lesson 1 of Quillo Databases: your first tables. A database is a file of tables; a table has columns with types and a row for each thing. Four settings, each a folder with its own database: the Corner Shop's products, the Library's books, the School's students and the Clinic's patients, every table strict so the database keeps its types.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop's products, in three migrations: the table, five products, and Tea
- [`library`](library): the Library's books: the table and its first rows in one migration
- [`school`](school): the School's students, with birthdays as year-month-day text
- [`clinic`](clinic): the Clinic's patients (the lesson's "your turn")

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

The video builds the Corner Shop up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the Corner Shop's products table, not strict yet
- [`steps/v2`](steps/v2): Tea, its price typed as "$4.50": SQLite keeps the text in an integer column (the lesson's mistake)
- [`steps/v3`](steps/v3): the table strict: that migration now fails, and says why
- [`steps/v4`](steps/v4): the price in cents, as the others
