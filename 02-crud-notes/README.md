# Build a Full CRUD App with Quillo: Notes, Live in Every Tab

A notes app: add, edit and delete notes, with validation, live in every open tab, and a JSON API.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): adding and listing notes
- [`steps/v2`](steps/v2): editing a note in place
- this folder: deleting, with ask() first, and the JSON API
