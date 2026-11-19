# Sycamore vs Quillo: a counter in Rust and WebAssembly, or one file?

A counter with a value that follows it, in Quillo: state and a plain let, and a route, in one file. The Short sets it next to Sycamore, client-side in WebAssembly, built with trunk.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
