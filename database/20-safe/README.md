# I Copied the Database File and It Was Empty: Backups That Work | Quillo Databases #20

Lesson 20 of Quillo Databases, the last: keep it safe. The Library on SQLite: a plain copy of library.db while the program runs has no tables (the data is still in library.db-wal); vacuum into, run from the REPL in a second terminal, writes a whole backup, named by the date, into backups/. A restore drill: delete from loans by mistake; stop the program (Quillo 0.8.6 leaves library.db-wal even after Ctrl-C), and a backup copied over library.db with the -wal still there is undone on the next open (0 loans); with library.db-wal and -shm removed first, the loans are back. The shop on PostgreSQL: pg_dump -Fc into backups/, and pg_restore into a new database, shop_restored, with the same counts. The exercise: a nightly backup, a scheduled job, in the Library's main.qwe.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`library`](library): the Library: backups/ for vacuum into, and the nightly backup job (the lesson's "your turn")
- [`shop`](shop): the Corner Shop on PostgreSQL, with backups/ for pg_dump
- [`bank`](bank): the Bank on PostgreSQL, as lesson 18 left it
- [`clinic`](clinic): the Clinic, as lesson 17 left it (SQLite)
- [`school`](school): the School, as lesson 16 left it (SQLite)
- [`concert`](concert): the Concert Hall, as lesson 11 left it (SQLite)

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

The version from the video runs on its own (`cd steps/library-v1 && ./run.sh --watch`):

- [`steps/library-v1`](steps/library-v1): the Library before the nightly job, for the copy, the backup and the restore drill
