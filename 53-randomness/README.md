# Roll the Dice, Hide the Treasure: random_int vs crypto.token in Quillo

A dice tower (random_int, in the browser) and a treasure chest whose link holds a secret code made with crypto.token(16) and checked with crypto.equal. The video first hides the chest with a four-digit random_int code, and finds it by trying all 9,000.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
