# The Log-In Bug That Sends Your Users to a Fake Site (Open Redirects, Fixed in Quillo)

The book club: members log in and are sent back where they were going, with next. The video's first version follows any next, so a link can send a member to a look-alike site after they log in; "starts with /" still lets //another.site through; local_path keeps next on this site. site_headers adds a content security policy and a referrer policy, and Quillo refuses log-in forms posted from other sites.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): redirect(next): any address at all
- [`steps/v2`](steps/v2): the tempting fix: next only if it starts with /
- this folder: redirect(local_path(next) ?? "/"), and site_headers
