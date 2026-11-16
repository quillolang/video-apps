# Forms and Validation in Quillo: Typed Routes, 422s and Live Hints

A workshop sign-up: a plain form, a typed route that refuses the wrong shape, friendly messages for each field, seats counted in the database, and the same rules as hints while you type.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a plain form, a typed route, and rules with a message for each field (422)
- [`steps/v2`](steps/v2): seats left in the database, and a redirect (303) to the thank-you page
- this folder: the form as a component: the same rules, as hints while you type
