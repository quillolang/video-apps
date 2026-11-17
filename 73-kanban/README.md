# Build a Kanban Board With Drag and Drop, Live on Every Screen | Quillo

Flip, a pancake kitchen's kanban board: orders go from Ordered to On the griddle to Served, by drag and drop, and every open screen follows. The video builds it in three steps: a board drawn by a view (steps/v1); a component with HTML5 drag and drop and a server fn that moves an order, which the other screen doesn't see (steps/v2); and live(orders), so every screen follows the table (the app).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the board, drawn by a view
- [`steps/v2`](steps/v2): drag and drop, and a server fn; the other screen stays behind
- this folder: live(orders): every screen follows
