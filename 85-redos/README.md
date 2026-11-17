# One Regex Froze My Server for 13.7 Seconds. Quillo Answered in 0.3 ms

Sprout Club, a newsletter sign-up whose email check is a pattern with a repeat inside a repeat. In plain Node (node/server.mjs), one long "email" of a's and a "!" makes the server try every way to split it, and every visitor waits; try.sh sends one and times a visitor. In Quillo the same pattern runs on the server in well under a millisecond, as the server's regex engine doesn't backtrack. A hint as you type runs in the browser, whose engine does, so the app bounds the counts there; quillo check warns about the unbounded one.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
./try.sh 8081 34          # 34 a's and a "!" to Node, and a visitor
./try.sh 8080 34          # the same to Quillo
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the sign-up checked on the server only, with the same pattern as Node's
- [`steps/v2`](steps/v2): a hint as you type, with the same pattern in the browser (quillo check warns; it can hang the tab)
- this folder: the hint's pattern with bounded counts
