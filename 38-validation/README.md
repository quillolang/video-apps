# Form Validation in Quillo: One Set of Rules, Browser and Server

Adopt a pet: one set of rules, written once as plain functions, that gives hints in the browser as you type and has the last word on the server. A record for the shape, a typed server fn that runs the same rules again, and a check only the server can make (that pet already has a home).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
