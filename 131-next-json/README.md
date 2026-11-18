# A Bad JSON Body: What Next.js Saves, What Zod Catches, and Quillo's Typed Routes

Bake-sale sign-ups, a JSON API, in Quillo (main.qwe, on 8080): `type Signup = { name: str, email: str, guests: int }`, `Signup(request.json)` with its error as a 400, and the rules a type can't say (an empty name, an email, guests from 0 to 8) as a plain function. steps/pattern is the first version, `route POST /api/signups { json: Signup }`. compare/next is the same API in Next.js 16.4.6 (create-next-app --api), a route handler two ways (variants/: naive.js, request.json() as the docs read a body; zod.js, a zod 4.6.7 schema with safeParse and z.flattenError). compare/send.sh sends each the same six bodies with curl; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                                    # Quillo's sign-ups, on 8080
(cd compare && ./send.sh http://localhost:8080)             # the six bodies
(cd compare/next && npm install && npm run dev)             # Next.js's (route.js is zod.js), on 3000
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
#   and cd compare\next; npm install; npm run dev
```

## The versions in the video

The first version from the video, a folder that runs on its own (`cd steps/pattern && ./run.sh --port 8081`):

- [`steps/pattern`](steps/pattern): the first version: `route POST /api/signups { json: Signup }`, a 400 for a body of the wrong shape, and no rules
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
