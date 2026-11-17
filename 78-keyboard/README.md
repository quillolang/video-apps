# Keyboard Only: the Sign-Up Form You Can't Finish Without a Mouse (Found and Fixed) | Quillo

Saturday Runners: a sign-up form that works with the keyboard alone. The video's first version (steps/v1) works with a mouse but not a keyboard: the distance chips, the box to tick and Join are spans and a div with onclick, so Tab never reaches them; the focus outline is turned off; and a screen reader is given plain text, not radios, a checkbox and a button. The app uses a form, labels, radios, a checkbox, a button and a visible focus ring.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a mouse-only form: spans and a div with onclick, and no focus ring
- this folder: real controls, labels, and a focus ring
