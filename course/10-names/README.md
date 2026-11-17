# Who's Voting? Names, One Vote Each, and Party Time | Learn to Code with Quillo #10

Movie Night, lesson 10 of Learn to Code with Quillo, the finished app: each friend gives a name (kept in a session), votes count once per person and movie (a voters table), Undo takes away only your own vote, and it runs on the home Wi-Fi with --host 0.0.0.0.

This lesson starts where [09-forms](../09-forms) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v0`](steps/v0): where lesson 9 ended
- [`steps/v1`](steps/v1): a name box: set_session, and session().name ?? ""
- [`steps/v2`](steps/v2): one vote each: migrations/005_voters.sql, insert or ignore, and vote's error shown in the list
- [`steps/v3`](steps/v3): the movie page's button keeps its count: vote(id) ?? votes
- this folder: Undo takes away only your own vote (the lesson's "your turn")
