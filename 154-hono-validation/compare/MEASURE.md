# Validation, Hono and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 23:45:44 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Bun:** 1.4.3; **Hono:** 4.13.19; **Zod:** 4.6.7; **@hono/zod-validator:** 0.9.1
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Playwright's Chromium

## The apps

The same order form in both: Name, Email, Loaves and Pickup, text inputs with no checks in the browser, posted to
`/order`. The same four rules and messages: a name that isn't blank ("Your name, please"), an email address ("An email
address, please"), a whole number of loaves from 1 to 12 ("From 1 to 12 loaves"), and a real date ("A date, like
2026-11-21"). A good order gets "Thanks, Ada! 2 loaves, for 2026-11-21."; a bad one the form again, with what was typed
and a message in red by each field that's wrong, and a 400.

- **Hono** (`hono/`): the official starter, `bunx create-hono@latest hono --template bun --install --pm bun`, then
  `bun add zod @hono/zod-validator`. `src/index.ts` became `src/index.tsx` (46 non-blank lines): a Zod schema
  (`z.string().trim().min(1)`, `z.email()`, `z.coerce.number().int().min(1).max(12)`, `z.iso.date()`, each with its
  message), a `Field` and an `OrderPage` component in hono/jsx, and `app.post('/order', zValidator('form', Order, hook),
  handler)`, where the hook, when the check fails, shows the page again with `result.data` and
  `z.flattenError(result.error).fieldErrors`. `variants/plain.tsx` is the same without the hook, as zod-validator's README
  shows it. `bunx tsc --noEmit -p .` (strict) passes for both. Run with `bun run src/index.tsx` (8090).
- **Quillo** (`../app/main.qwe`, 37 non-blank lines, and two earlier versions, each a folder that runs):
  - `../steps/v1`: types in the route's pattern, the way Quillo's guide shows (`route POST /order { form: { name: str,
    email: str, loaves: int, pickup: date } }`), and the rules in `problems`, a function giving a message by each field.
    `quillo check`: `main.qwe: ok (2 routes, 3 functions, 0 components)`.
  - `../steps/v2`: and a second `route POST /order` with no pattern, since a route whose pattern doesn't match lets the
    next route try: the page again with `problems(request.form)`. `quillo check`: `main.qwe: ok (3 routes, 3 functions, 0 components)`.
  - `../app`: every field taken as text (`str`) in the pattern, every check in `problems`, then `int(loaves)`; the second
    route gone. `quillo check`: `main.qwe: ok (2 routes, 3 functions, 0 components)`.

## Someone types "two" (order.sh)

`./order.sh hono|quillo [field=value ...]` posts one order to the running app (Ada, ada@example.com, 2 loaves,
2026-11-21, with the fields given changed) and prints the status and what the page says, or the answer itself when it
isn't the page, cut to one line (`…`). Each version was run on its own, and asked:

```
# with variants/plain.tsx running
$ ./order.sh hono loaves=two
Hono    400  {"success":false,"error":{"name":"ZodError","message":"[\n  {\n    \"expected\": \"number\",\n    \"co…
# with src/index.tsx running
$ ./order.sh hono loaves=two
Hono    400  the form again. Loaves: From 1 to 12 loaves
$ ./order.sh hono loaves=02
Hono    200  Thanks, Ada! 2 loaves, for 2026-11-21.
# with steps/v1 running
$ ./order.sh quillo loaves=two
Quillo  400  bad request: no route pattern matches this request
# with steps/v2 running
$ ./order.sh quillo loaves=two
Quillo  400  the form again. Loaves: From 1 to 12 loaves
$ ./order.sh quillo loaves=02
Quillo  400  the form again, with no message
# with app running
$ ./order.sh quillo loaves=two
Quillo  400  the form again. Loaves: From 1 to 12 loaves
$ ./order.sh quillo loaves=02
Quillo  200  Thanks, Ada! 2 loaves, for 2026-11-21.
```

- Hono with no hook answers with Zod's whole result as JSON, its issues as a string inside it; zod-validator's source
  (`node_modules/@hono/zod-validator/dist/index.mjs`) has `if (!result.success) return c.json(result, 400);`.
- Quillo's v1 answers `bad request: no route pattern matches this request` (text/plain) and writes the reason in its log:

```
quillo: warning: POST /order (rid e89fc0146030891b): 400: POST /order (main.qwe:35): `form.loaves` is text, not an int
```

- The browser shots (`shots.mjs`) fill in the form in Chromium and press Order, for each version: the same answers.

## Two kinds of int (ints.sh)

`./ints.sh` starts `ints/main.qwe` (`ints/main.qwe: ok (2 routes, 0 functions, 0 components)`) on 8081 with the app's Quillo, and sends each text as a form's
`n`: a route `{ form: { n: int } }` answers with the int it made, and a second route, when that one doesn't match, with
what `int()` makes of the same text:

```
"2"     route: 2
"02"    route: no match; int(): 2
"+2"    route: no match; int(): 2
" 2 "   route: no match; int(): 2
"2.5"   route: no match; int(): an error
"two"   route: no match; int(): an error
```

So in steps/v2, "02" didn't match the first route, `problems` (with `int()`) found nothing wrong, and the form came back
with no message.

## Odd values (edges.sh)

`./edges.sh` sends the same odd values to both final apps, one field changed each time, and shows what each does:

```
sent                  Hono (Zod)                    Quillo
loaves="1e1"          ordered: 10 loaves            "From 1 to 12 loaves"
loaves="0x0A"         ordered: 10 loaves            "From 1 to 12 loaves"
loaves="02"           ordered: 2 loaves             ordered: 2 loaves
loaves="2.5"          "From 1 to 12 loaves"         "From 1 to 12 loaves"
email="a@b.c"         "An email address, please"    "An email address, please"
pickup="2026-02-29"   "A date, like 2026-11-21"     "A date, like 2026-11-21"
name="   "            "Your name, please"           "Your name, please"
```

Zod's `z.coerce.number()` uses JavaScript's `Number()`, so "1e1" and "0x0A" are 10. Quillo's email rule is a pattern
written in main.qwe (`EMAIL`); Zod's `z.email()` is built in.
