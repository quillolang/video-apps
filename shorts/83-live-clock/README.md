# A live clock the server ticks: events() and listen() | Quillo

A live clock the server keeps: GET /clock answers with events(f), Server-Sent Events, sending the time every second for an hour; the page's Clock component listen()s to it and shows each one. curl -N prints the events as they come, and when a tab closes, its stream ends at the next send.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
