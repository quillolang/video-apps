# Leptos and Dioxus vs Quillo: SSR, SPA Routing and Components, Measured

The Trail Guide three times, for the video comparing Rust's full-stack frameworks with Quillo 0.8.8: server rendering, single-page navigation, components and routing. app/ is Quillo's (one route makes every address; url() picks the page). compare/leptos is Leptos 0.8.23 from cargo-leptos's start-axum template, compare/dioxus is Dioxus 0.7.10 from dx new (fullstack, router); each folder's versions/ holds the variants the video builds (SsrMode::Async, the size settings, the compile errors). compare/quillo-title adds page titles, compare/quillo-fold a card that folds. compare/build.sh, measure.sh, run-compare.sh and errors.sh make every result; MEASURE.md lists them. For updates, see the official sites: https://leptos.dev, https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                               # Quillo's Trail Guide: http://127.0.0.1:8080

# Leptos (needs Rust and cargo-leptos: cargo install cargo-leptos --locked)
cd compare/leptos && cargo leptos watch

# Dioxus (needs Rust and dx: cargo install dioxus-cli --locked)
cd compare/dioxus && dx serve --platform web

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd
# Rust, cargo-leptos and dx install the same way on Windows (rustup from https://rustup.rs).
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
