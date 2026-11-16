# Reactivity in Quillo: State, Page State and live()

A focus board: a timer and a checklist with their own state, a focus switch in page state, and today's sessions, live for everyone.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): component state: the timer and the checklist
- [`steps/v2`](steps/v2): page state: the focus switch both of them follow
- this folder: server state: today's sessions, live in every tab
