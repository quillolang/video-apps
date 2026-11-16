# From Monolith to Services in Quillo: One Program, --split

A bakery that starts as one program, then moves its billing into a service: the same code runs in one process, or split into processes with --split, --scale and --watch, or on two servers with --service-url.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the monolith: the bakery and its invoices in one program
- this folder: billing as a service (billing.qwe): run it with quillo run main.qwe, or quillo run main.qwe --split
