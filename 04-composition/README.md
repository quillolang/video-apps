# Components and Views in Quillo: Composing a Page

A café menu made of views and components: a frame, cards, a Stepper, and an order every card shares.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the views, and a MenuItem component
- [`steps/v2`](steps/v2): the Stepper child component, with a function prop
- this folder: page state: one order, shared by every card and the header
