# CSRF in 2026: What SameSite Stops, What It Doesn't, Shown Live

Piggy Bank, and another site that tries to move Ada's money while she's logged in: cross-site request forgery, in Chromium in 2026. The Node bank (node/bank.mjs) gives a session cookie with no SameSite, so Chromium treats it as Lax: a form post from another site (other-site/prize.html) still carries it for two minutes after it's set, and $50 moves; after that it doesn't. With SAMESITE=None, or a link that sends (other-site/link.html), it moves every time. The Quillo bank refuses a form post from another site's page with 403, before any route runs (steps/v1). A link that sends (steps/v2) is a GET, which Quillo can't tell from one you meant, so the app sends money with a form only.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                                      # the Quillo bank, on 8080
node node/bank.mjs                                            # the Node bank, on 8081
python3 -m http.server 9999 --bind 127.0.0.1 -d other-site    # another site
# then log in at the bank, and open http://127.0.0.1:9999/prize.html?bank=http://localhost:8080
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): sending with a form: a form post from another site gets 403
- [`steps/v2`](steps/v2): a link that sends, too (a GET): the other site's link moves the money
- this folder: the link taken out: sending is a form, and only a form
