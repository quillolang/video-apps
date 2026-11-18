# Values Go In as Parameters: ? and :name, and Why O'Brien Broke the Page | Quillo Databases #4

Lesson 4 of Quillo Databases: values go in as parameters. A value from a form or an address goes in as :name (or ?), passed after the SQL, never pasted into it. The shop's search box, the library's member lookup (pasted, a name like O'Brien breaks it and x' or '1'='1 shows every member; as a parameter, both are just names), the school by year, and the clinic's search with two optional filters.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: a search box, where name like :q
- [`library`](library): the Library: two more members (one is Liam O'Brien), and a member found by name, :name
- [`school`](school): the School: the students in a year, :year, an int from the address
- [`clinic`](clinic): the Clinic: a search with two optional filters, :name and :after (the lesson's "your turn")

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

- [`steps/v1`](steps/v1): the Library with the member's name pasted into the SQL: O'Brien breaks it, and x' or '1'='1 shows every member (the lesson's mistake; quillo check warns)
