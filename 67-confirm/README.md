# "Are You Sure?" Without the Callbacks: Confirm Dialogs in Quillo (ask, notify, navigate)

Pen Pals: a "delete my account" button that asks first. The video's first version builds the dialog by hand, with a state and three handlers (and no Escape, focus or screen reader); the app asks with ask(), which waits for the answer, then deletes and navigate()s to goodbye, or notify()s that nothing was deleted.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a dialog made by hand: a state, and three handlers
- this folder: ask(), notify() and navigate()
