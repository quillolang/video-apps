# The Case of the Broken Pizza Order: Logs, Request IDs and Metrics in Quillo

Slice: pizza by the slice, the bill split between you and your friends. Run it with ./run.sh --log json --metrics, and read its log with grep '^{' and jq. This is the fixed version; the video finds its bug in the log.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
