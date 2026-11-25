# Quillo vs Rails + Hotwire: Where State Lives (Sessions, Turbo Streams, Solid Cable)

The page from "Quillo vs Rails + Hotwire: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Rails 8.1.4.1 with Turbo and Stimulus (compare/rails: a Stimulus controller kept with data-turbo-permanent, params[:n], the cookie session, an atomic number in the Puma process, Active Record, and a Turbo Stream broadcast over Action Cable on Solid Cable).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
