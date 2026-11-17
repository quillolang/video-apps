# One URL Downloads Your .env File: Path Traversal, Found and Fixed

Luigi's downloads: a file from the files folder, by its name, in plain Node (node/server.mjs) and in Quillo (main.qwe). In Node, path.join('files', name) lets ?name=../.env hand out the program's secrets (.env holds made-up ones) and ?name=../node/server.mjs its own code. In Quillo, file() refuses a path with .. or a leading /, so both are 404s; and an avatar upload whose file name is ../main.qwe is saved in avatars/, as main.qwe, since only the name comes through.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -s 'localhost:8081/download?name=../.env'
```
