# Permissions in Deno vs Quillo: --allow-net, quillo.policy, and Code You Didn't Write

A friend's fortune cookie page (video 42's), in Quillo (main.qwe, on 8080) with quillo.policy beside it: the effects, hosts and environment names it may use, and limits. compare/deno is the same page in Deno 2.9.8 (main.ts, on 8000, `Deno.serve`): deno.json holds the same permissions as a permission set (`deno run -P`), and variants/guestbook.ts is version 2. compare/crack.sh asks a running app for a billion cookies, and for its home page meanwhile. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
echo 'APP_NAME=Lucky Cookies' > .env && ./run.sh   # Quillo's page, under quillo.policy, on 8080
(cd compare/deno && echo 'APP_NAME=Lucky Cookies' > .env && deno run -P --env-file=.env main.ts)   # Deno's, on 8000
(cd compare && ./crack.sh 8080)
# Windows (PowerShell), with Quillo from quillolang.org and Deno from deno.com: quillo run main.qwe
```

## The versions in the video

The video ends with version 2, which adds a guestbook kept in a file. Under this quillo.policy it fails `quillo check` on purpose (`read_file` and `write_file` need the fs effect, which the policy doesn't allow):

- [`steps/guestbook`](steps/guestbook): version 2: the same page and a guestbook in a file; `quillo check` refuses it before it runs
- this folder: the friend's page and its quillo.policy (the same as video 42's)

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
