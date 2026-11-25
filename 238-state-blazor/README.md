# Quillo vs Blazor: Where State Lives (Circuits, ProtectedLocalStorage, Sticky Sessions)

The page from "Quillo vs Blazor: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Blazor on .NET 11.0.0, Interactive Server (compare/blazor: component fields in the tab's circuit, [SupplyParameterFromQuery], ProtectedLocalStorage, a singleton service, SQLite, and a C# event).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
