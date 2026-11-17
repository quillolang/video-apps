# A Link Shortener With Click Counts, Against the Clock (and the 301 That Stopped Counting) | Quillo

Snip, a link shortener: paste a long link, get /s/ and five letters, and see how many times each was followed. The video's speedrun answers a short link with a 301, which the browser keeps, so only the first click is counted (steps/v1); the app answers with a 302, so every click comes back and counts. Only http and https links are taken.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the speedrun's version: a 301, so the browser counts once
- this folder: a 302: every click counted
