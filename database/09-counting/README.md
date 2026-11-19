# Counting and Summing: count, sum, avg, group by and having | Quillo Databases #9

Lesson 9 of Quillo Databases: counting and summing. count, sum and avg turn many rows into one value; group by gives one row for each group of rows that share a value (sales per day, loans per member, each class's average), and having keeps only some groups, after they are counted. Over a left join, count(*) counts a member with no loans as 1 (their one row, with null); count(loans.id) counts only real loans, so they have 0.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`shop`](shop): the Corner Shop: three more days of orders (007_more_orders.sql), /sales (group by day) and /big-days (having)
- [`library`](library): the Library: /loans-per-member with count(loans.id), and /busy-members (having count >= 2)
- [`school`](school): the School: a grade on each enrollment (003_grades.sql), and /averages
- [`clinic`](clinic): the Clinic: /busiest, appointments per doctor (the lesson's "your turn")
- [`bank`](bank): the Bank, as lesson 5 left it
- [`concert`](concert): the Concert Hall, as lesson 5 left it

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

One version from the video runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the Library's loans per member with count(*) over a left join: members with no loans show 1 (the lesson's mistake)
