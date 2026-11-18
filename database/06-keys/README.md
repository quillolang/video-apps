# Tables That Point at Each Other: Foreign Keys and on delete | Quillo Databases #6

Lesson 6 of Quillo Databases: tables that point at each other. A foreign key (references) makes the database check that a row points at a row that's there: a loan at a book and a member, an order at a customer, an appointment at a patient. It refuses a loan for a book that isn't there, and a member deleted while loans still point at them; you choose what happens instead: refuse, and say why (the library's loans), on delete cascade (an order's items go with it), or on delete set null. db.error_kind says "foreign_key".

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`library`](library): the Library: loans that point at books and members, and a page to remove a member, refused in words while they have books out
- [`shop`](shop): the Corner Shop: orders that point at customers, and order items that go with their order (on delete cascade)
- [`clinic`](clinic): the Clinic: appointments that point at patients, and doctors, each appointment's (the lesson's "your turn")
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

- [`steps/v1`](steps/v1): the Library's remove page passing the database's refusal on: removing a member with books out is an error page (the lesson's mistake)
- [`steps/v2`](steps/v2): the Clinic with appointments, before the doctors of the lesson's "your turn"
