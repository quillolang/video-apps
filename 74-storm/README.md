# A State Storm: 500 Tickers, 31,260 Updates a Second, Still 60 FPS | Quillo

Storm: a wall of 500 made-up stock tickers, all changing at once. A component keeps them in one state list; every so many milliseconds (every()) it makes a new list where some stocks take a step and the rest stay as they were, and only the prices that changed are written to the page. Controls set how often it ticks and how many in a hundred change.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
