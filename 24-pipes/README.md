# Lists and Maps Without Mutation in Quillo: An Arcade High-Score Table

Comet Catcher high scores: a leaderboard built with pipes (group_by, values, map, sort_by), medals from a match, and new scores added with plays = plays | push(...), since nothing in Quillo changes in place.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
