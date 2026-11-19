# Security Headers: Express, helmet and Quillo, and the Like Button a Policy Broke

Trail Club's home page in Quillo (main.qwe, on 8170): the trails, and a like button (a component and two server fns), with site_headers adding the guide's policy (content-security-policy: default-src 'self') and a referrer-policy. Quillo names its own scripts in the policy by their hashes, so the button still works. steps/v1 is the page with Quillo's own headers. compare/express is the same page in Express 5.3.0: as it comes (app.js), with helmet 8.3.0's defaults (variants/helmet.js, where the page's inline script is refused), and with the script in public/like.js (variants/helmet-file.js). compare/headers.mjs reads each page's headers, frames it from another site, and clicks the button in a browser; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8170   # Quillo's: http://localhost:8170
(cd compare/express && npm install && node app.js)   # Express's: http://localhost:3000
(cd compare && node headers.mjs express out.json && node headers.mjs helmet out.json && node headers.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8170
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the page with Quillo's own headers (nosniff, and frames from the same site only)
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
