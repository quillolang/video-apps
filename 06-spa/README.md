# A Single-Page App in Quillo: Links, url() and match

A recipe book as a single-page app: pages that change without reloading, a page per recipe at its own address, favourites kept while you move around, and real 404s.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): two pages as links: url(), match, and one route for every address
- [`steps/v2`](steps/v2): a page for each recipe, at /recipes/:id
- this folder: favourites, kept in the App while you move between pages
