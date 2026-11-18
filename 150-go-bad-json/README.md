# A Bad JSON Body in Go vs Quillo: Zero Values, Unknown Fields, and DisallowUnknownFields

The bake sale's sign-ups API in Quillo (main.qwe, on 8080, the same as video 131's): `type Signup = { name: str, email: str, guests: int }`, the body read with `Signup(request.json)`, and the rules in `problems`. compare/go is the same API in Go 1.27.4 with only the standard library: go/main.go, the fixed one (DisallowUnknownFields, Guests a *int, the rules), and go/variants/naive.go.txt, the first try (a plain Decode). compare/build-variants.sh builds both; compare/send.sh sends seven bodies; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's API, on 8080
(cd compare/go && go run .)                  # Go's fixed API, on 8090
(cd compare && ./send.sh http://localhost:8090 && ./send.sh http://localhost:8080)
# Windows (PowerShell), with Quillo from quillolang.org and Go from go.dev: quillo run main.qwe; cd compare\go; go run .
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
