# Search as You Type Over 10,000 Recipes: LIKE vs SQLite Full-Text Search | Quillo

Pantry: 10,000 made-up recipes, searched as you type. A component calls a server fn at every key. The video's first version (steps/v1) searches with LIKE: the names with what you typed in them; the app uses SQLite's full-text search (FTS5), which finds every typed word, in any order, from its first letters, with each word quoted so a stray quote can't break the query.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): LIKE: the names with what you typed in them
- this folder: SQLite's full-text search
