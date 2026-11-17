# Remember It: the Database | Learn to Code with Quillo #6

Movie Night, lesson 6 of Learn to Code with Quillo: the movies move into a SQLite database, made by migrations; the home page queries them, and each movie's page asks for one with a ? placeholder.

This lesson starts where [05-components](../05-components) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v0`](steps/v0): where lesson 5 ended: the movies in the code
- [`steps/v1`](steps/v1): a movies table from migrations/001_movies.sql; all_movies() for the home page
- [`steps/v2`](steps/v2): db.one with a ? placeholder for each movie's page
- this folder: a second migration, 002_more_movies.sql, adds Pirates of the Bathtub (the lesson's "your turn")
