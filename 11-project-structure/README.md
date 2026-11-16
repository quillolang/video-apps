# Project Structure in Quillo: One File to Many, use and import

A plant care list, split the way bigger programs are: main.qwe lists the parts, lib/ holds the helpers and server fns, ui/ the views and components, migrations/ the tables, data/ the database and public/ the files served as they are.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the same program, all in one file
- this folder: the program split into lib/, ui/, migrations/, data/ and public/
