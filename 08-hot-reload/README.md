# Hot Reload in Quillo: Edit While It Runs, Keep Your State

A game-night scoreboard to edit while it runs: two Score components, a Cheer button counted on the server, and a notes field. Run it with --watch, change it, and see what each save keeps.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
