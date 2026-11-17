# Let Users Write Code, Safely: a Spreadsheet with Sandboxed Formulas in Quillo (run_script)

The bake sale's spreadsheet: cells hold numbers, words, or formulas people type, written in Quillo and run with run_script, which sees only the cells before it: no files, environment, database or network, 20,000 steps and 1 MB at most. Try to break out of it!

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
