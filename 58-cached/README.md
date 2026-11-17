# Make a Slow Page Instant by Deleting One Line: Cached Views in Quillo

The Neon Arcade's leaderboard: a million plays added up into the top ten, in a view. With the time in it (date.now()), the view runs for every page; without it, Quillo keeps its HTML until plays is assigned, so pages are instant, and a new play shows at once.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
