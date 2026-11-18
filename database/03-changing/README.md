# Changing Data: INSERT, UPDATE, DELETE (and the WHERE You Forgot) | Quillo Databases #3

Lesson 3 of Quillo Databases: changing data. insert adds a row (db.exec gives its id as last_id), update changes rows, delete removes them, and changes says how many rows a statement touched. An update with no where changes every row: select with the same where first, then change, and read changes.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop, changed in the REPL: Butter added, Milk's price, Coffee's stock, Apples gone (the lesson's mistake and its fix are REPL sessions too)
- [`library`](library): the Library: a page of every member; a new copy of Moby-Dick, and a member who left
- [`school`](school): the School: a new student, one a year up, and one who left
- [`clinic`](clinic): the Clinic: a patient's new phone number (the lesson's "your turn")

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
