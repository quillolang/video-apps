# Bill Once: Idempotent Microservices in Quillo (Retries, Crashes, Double Orders)

The shop from "Bill Once", in the Quillo Microservices playlist: main.qwe sells a mug and bills through billing.qwe, a service, with idempotent on both sides (the form's key in the shop, the call's id in billing). steps/v1 is the same shop without it. Run either with quillo run main.qwe --split.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video starts from the shop without idempotent, kept as a folder that runs on its own (cd steps/v1 && ./run.sh --split):

- [`steps/v1`](steps/v1): the shop from video 222, without idempotent (Back, then Buy again bills twice)
- this folder: compare/: measure.mjs (every test in the video: the same buy twice, billing killed mid-invoice, the cost), MEASURE.json (the run shown) and logs/ (the outputs shown)

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
