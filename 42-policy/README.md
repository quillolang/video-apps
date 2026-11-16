# Run Code You Didn't Write: Locking a Program Down with quillo.policy

Fortune cookies: a page a friend wrote, with a few surprises in it (a stats call, a /debug route, a link preview that fetches anything, a loop with no end), run under quillo.policy, which says what the program may do whatever its code says. Put APP_NAME and SECRET_KEY in a .env to see the policy hide the second.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
