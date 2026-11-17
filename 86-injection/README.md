# One Search Box Dumped Every Password Hash (SQL Injection, Found and Fixed)

Bookworm, a bookshop's member search over SQLite, written to be broken and then fixed. In plain Node (node/server.mjs, with node:sqlite) the search puts the visitor's text inside the SQL, so `' OR 1=1 --` lists every member and a UNION reads every password hash. The video's first Quillo version (steps/v1) builds the SQL the same way, and has the same hole; quillo check warns about it. With the value as a `?` (steps/v2) the same text is only text. The app adds a member list sorted by a column the visitor picks, one of two names, put in with sql_name.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -sG localhost:8080/search --data-urlencode "q=' OR 1=1 --"
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the SQL put together by hand, as in Node: injectable, and quillo check warns
- [`steps/v2`](steps/v2): the search's value passed as ?
- this folder: a member list sorted by ?by=name or ?by=joined, a column name put in with sql_name
