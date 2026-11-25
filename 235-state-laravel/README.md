# Quillo vs Laravel + Livewire: Where State Lives (Sessions, Cache, wire:poll)

The page from "Quillo vs Laravel + Livewire: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Laravel 13.44.1 with Livewire 4.4.10 (compare/laravel: one single-file component, resources/views/pages/⚡counters.blade.php, with a property, a #[Url] property, the session, the cache, a table, and an island with wire:poll).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
