# Rules the Database Keeps: not null, unique, check, and One Account per Email | Quillo Databases #5

Lesson 5 of Quillo Databases: rules the database keeps. not null, unique, check and default, written into the table, hold for every way in: a form, the REPL, a script. db.error_kind says which rule said no, so the page can say it in words. The shop's customers (one account per email), the bank's accounts (no balance below zero, 0 to start), the library's members (one member per email, and no email is fine), and the concert hall's bookings (one per seat, the lesson's "your turn").

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: customers, with not null, unique and a default date, and a sign-up page that turns a refusal into a message
- [`bank`](bank): the Bank (new): accounts whose balance never goes below zero (check), and starts at 0 (default)
- [`library`](library): the Library: a unique index on members' email; members with no email are fine
- [`concert`](concert): the Concert Hall (new): one booking per seat at each show, unique (show, seat) (the lesson's "your turn")
- [`school`](school): the School, as lesson 4 left it
- [`clinic`](clinic): the Clinic, as lesson 4 left it

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

The video's mistake is a version of the Corner Shop that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the shop checking "is that email taken?" in its code only: the form refuses a second account, but the REPL adds one (the lesson's mistake)
