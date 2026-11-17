# React's useEffect: Four Classic Bugs, and a Language With No useEffect

Luigi's kitchen, four small parts, twice. In React (react/, a Vite dev server on 5173, StrictMode as Vite's starter has it, /api proxied to node/server.mjs on 8081): a timeout that adds the count it was made with (three clicks, +1), an interval with no cleanup that keeps calling the oven's server after its panel closes, an interval whose delay its effect ignores, and a list worked out in an effect whose dependency is new each render, which loops (Maximum update depth exceeded). In Quillo (main.qwe, on 8080), run_after and every read the state as it is, every stops with the component that called it and starts over when its delay changes, and the list is a let. steps/assign keeps the list the effect's way, an assignment, which quillo check warns runs once.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo's kitchen, on 8080 (/hits: the oven's calls)
node node/server.mjs      # the oven's server for React, on 8081
(cd react && npm install && npm run dev)   # React's kitchen, on 5173
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/assign`](steps/assign): the cheap dishes kept in state by an assignment, as React's effect kept them: quillo check warns
- this folder: the finished app
