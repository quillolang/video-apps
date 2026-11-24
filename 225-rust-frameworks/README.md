# Quillo vs 6 Rust Web Frameworks: Axum, Actix, Rocket, Leptos, Dioxus, Yew (Measured)

The guestbook from "Quillo vs Six Rust Frameworks": a form, and every entry, newest first, in SQLite. main.qwe is the Quillo version; compare/ has the same app in Axum 0.8.9 (and a tuned Axum), Actix Web 4.20, Rocket 0.5.4, Leptos 0.8.23, Dioxus 0.7.10 and Yew 0.23 with an Axum API.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
