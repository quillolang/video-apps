# Changing a Table That Has Data: Migrations Done Right | Quillo Databases #10

Lesson 10 of Quillo Databases: changing a table that has data. Migrations are the database's history: each file runs once, in name order, and is recorded in _quillo_migrations with its SHA-256, so a file that ran is never edited (Quillo warns that it changed and doesn't run it again, and a fresh database would get a different table). A change is the next file: add a column and fill it (the Library's phones, and first and last names split from the name), rename a column (the Clinic's starts_at, and every query that named it), and a unique index once the duplicates are gone (the School's emails).

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`library`](library): the Library: 008_member_phones.sql and 009_member_names.sql (003 as it ran), and /by-last-name
- [`clinic`](clinic): the Clinic: 005_starts_at.sql renames appointments.at
- [`school`](school): the School: emails (004_student_emails.sql, two the same) and 005_unique_emails.sql, which makes them different and then unique, and /emails (the lesson's "your turn")
- [`shop`](shop): the Corner Shop, as lesson 9 left it
- [`bank`](bank): the Bank, as lesson 5 left it
- [`concert`](concert): the Concert Hall, as lesson 5 left it

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

Two versions from the video, each a setting of its own:

- [`steps/v1`](steps/v1): the Library with 003_members.sql edited after it ran (the lesson's mistake): an old database warns and has no phone; a fresh one has it
- [`steps/v2`](steps/v2): the School with a unique index made over emails that are the same: the migration fails and the School doesn't start
