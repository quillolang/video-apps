# Many to Many: A Table in Between, and Its Primary Key | Quillo Databases #8

Lesson 8 of Quillo Databases: many to many. When each row on one side can go with many on the other, both ways (students and classes, books and authors, products and shelves, doctors and specialties), the pairs get a table in between, one row per pair, and you join through it either way. Its primary key is the pair, so a pair is never there twice: the same insert is refused (UNIQUE constraint failed), and with on conflict do nothing it changes nothing (changes: 0).

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`school`](school): the School: classes, and enrollments in between (the pair as its primary key); /classes, and an /enroll form that says when a student is in a class already
- [`library`](library): the Library: authors, and book_authors in between; Good Omens has two authors; /by-author?name=Neil+Gaiman
- [`shop`](shop): the Corner Shop: shelves (categories), and product_categories in between; /shelf?shelf=Breakfast
- [`clinic`](clinic): the Clinic: specialties, and doctor_specialties in between; /specialty?specialty=Pediatrics (the lesson's "your turn")
- [`bank`](bank): the Bank, as lesson 5 left it
- [`concert`](concert): the Concert Hall, as lesson 5 left it

```sh
cd school
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

One version from the video runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the School with enrollments and no primary key: the same student in the same class twice (the lesson's mistake)
