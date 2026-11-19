# Leptos vs Quillo: a to-do list in Rust and WebAssembly, or one file?

The to-do list from Vue's tutorial, in Quillo: two states and an id, a form with its own onsubmit, value={draft} two-way by itself, and a for in the markup. The Short sets it next to Leptos, client-side in WebAssembly.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
