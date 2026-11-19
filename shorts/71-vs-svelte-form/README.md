# A form that checks its input: SvelteKit form actions vs a typed Quillo route

A sign-up form that checks the age, in Quillo: a route whose pattern { form: { email: str, age: int } } makes age an int, and a route for anything else. The Short sets it next to a SvelteKit form action.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
