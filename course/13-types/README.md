# Types of Our Own: Catch Typos Before They Run | Learn to Code with Quillo #13

Movie Night, lesson 13 of Learn to Code with Quillo (part 2): a Movie type and a Suggestion type in lib/movies.qwe, so the server fns give list<Movie> and list<Suggestion>, and a typo in a field's name is caught before it runs.

This lesson starts where [12-files](../12-files) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v0`](steps/v0): where lesson 12 ended: no types of our own
- [`steps/v1`](steps/v1): type Movie, and all_movies() -> list<Movie>
- this folder: type Suggestion, and all_suggestions() -> list<Suggestion> (the lesson's "your turn")
