# The Same API in Plain Node and in Quillo: 46 Lines vs 19

Bookshelf, a little JSON API written twice: in plain Node with only node:http (node/server.mjs), and in Quillo (main.qwe). GET /books, GET /books/:id, and POST /books with a title and pages. In Quillo the route's pattern reads and checks the body; the video's first version (steps/v1) answers any other body with Quillo's plain 400, and the app adds a last route that says, in JSON, what a book needs.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                 # Quillo, on 8080
node node/server.mjs     # Node, on 8081
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): without the last route: any other body gets Quillo's plain 400
- this folder: a last route that says what a book needs
