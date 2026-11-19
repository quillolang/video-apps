# Axum vs Quillo: the JSON API from Axum's README, in 5 lines

The JSON API from Axum's README, in Quillo: two record types, a hello route, and POST /users whose pattern makes the body a CreateUser and answers 201 with a User. The Short sets it next to Axum.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
