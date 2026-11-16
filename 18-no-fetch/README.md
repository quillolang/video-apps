# No fetch in Quillo: Call the Server Like a Function

A live lunch poll whose buttons call the server like plain functions: no API route, no fetch, no JSON, no async/await, no try/catch, and every open tab follows the votes with live().

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
