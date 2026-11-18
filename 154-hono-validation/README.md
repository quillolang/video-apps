# Form Validation in Hono vs Quillo: Zod, a Hook, and “Two” Loaves

The bakery's order form, checked on the server, in Quillo (main.qwe, on 8080): name, email, loaves (1 to 12) and a pickup date, and the form comes back with a message by each field that's wrong. compare/hono is the same form in Hono 4.13.19 on Bun 1.4.3, with Zod 4.6.7 and @hono/zod-validator 0.9.1: src/index.tsx with a hook that shows the form again, and variants/plain.tsx as zod-validator's README shows (no hook: JSON). compare/order.sh posts one order to either; compare/edges.sh sends odd values to both; compare/ints.sh shows what a route's int and the int function each make of the same text; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh   # Quillo's form, on 8080
(cd compare/hono && bun install && bun run src/index.tsx)   # Hono's, on 8090
(cd compare && ./order.sh quillo loaves=two && ./order.sh hono loaves=two && ./edges.sh)
# Windows (PowerShell), with Quillo and Bun from quillolang.org and bun.sh: quillo run main.qwe
```

## The versions in the video

The video builds the Quillo side in three steps. Each is a folder that runs on its own (`cd steps/v1 && ./run.sh`):

- [`steps/v1`](steps/v1): types in the route's pattern (loaves: int, pickup: date) and the rules in problems: a wrong type gets a bare 400, "bad request: no route pattern matches this request"
- [`steps/v2`](steps/v2): and a second route, for a request the first doesn't match: "two" gets its message, but "02" comes back with no message (the route's int refuses it, the int function takes it)
- this folder: each field taken as text, and every check in problems, in one place

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
