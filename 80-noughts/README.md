# Tic-Tac-Toe for Two Browsers: One Game on the Server, Live on Both Screens | Quillo

Noughts, tic-tac-toe for two browsers: the game lives on the server in one global, server fns play a move (refusing one out of turn, on a taken square, or after the end) and start again, and each player's page (/x and /o) follows the game with live. The video's first version (steps/v1) is the same game at one browser, kept in a component's state.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the game at one browser, in a component's state
- this folder: two browsers, one game on the server
