# Live updates between tabs: React + socket.io vs Quillo's live()

A wall that every open tab sees at once, in one Quillo file: state items = live(notes) runs again whenever the notes table changes, on every page. The Short sets it next to React and socket.io.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
