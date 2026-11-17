# Build a Tiny Wiki: Markdown Pages, [[Links]], and Every Version Kept | Quillo

Wikiwiki, a tiny wiki for a bakery: pages in Markdown, [[links]] between them (a missing page's link reads "Name?" and starts it), and every save kept as a row, so each page has a history and any old version can be read. The video builds it in three steps: pages and an editor (steps/v1), the links (steps/v2), and the history (the app).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): pages in Markdown, and an editor
- [`steps/v2`](steps/v2): [[links]] between pages
- this folder: each page's history
