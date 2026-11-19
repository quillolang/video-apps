# Joins: Put the Names Back with join, left join and as | Quillo Databases #7

Lesson 7 of Quillo Databases: joins. A join puts rows from two tables side by side, matched by on: a loan with its book's title and its member's name, an order's items with their customer and product. When two tables both have a column called name, a row keeps only one (the last), so as gives each its own name. A plain (inner) join keeps only rows that found a match; a left join keeps every row of the first table, with null where nothing matched, and where ... is null finds the rows with no match at all.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`library`](library): the Library: the loans page with titles and names (two joins), and "Who has what": every member and the books they have out, with left joins
- [`shop`](shop): the Corner Shop: an orders page, each item with its customer and product, named with as
- [`clinic`](clinic): the Clinic: patients who never came, with a left join and where appointments.id is null (the lesson's "your turn")
- [`bank`](bank): the Bank, as lesson 5 left it
- [`concert`](concert): the Concert Hall, as lesson 5 left it
- [`school`](school): the School, as lesson 4 left it

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

- [`steps/v1`](steps/v1): the Library with the loans page joined, before "Who has what"
- [`steps/v2`](steps/v2): the Library's "Who has what" with plain joins: members who never borrowed are missing (the lesson's mistake)
