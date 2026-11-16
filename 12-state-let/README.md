# State vs let in Quillo: What Changes, What Follows, What's Shared

A tip splitter: what you change is state, what follows from it is let, and a top-level let on the server holds the tips paid, shared by every visitor until a restart.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the mistake: the sums written as state, set once, so they don't follow
- this folder: the sums as let, worked out again whenever what they read changes
