# Change One Number in the URL and See a Stranger's Order (IDOR, Fixed)

Luigi's order tracker: an order's page by its number. The video's first version (steps/v1) shows any order to anyone who asks, so Ada, changing 42 to 41, sees Bob's pizza and address, and so does someone who never logged in. The app keeps the orders behind a signed_in middleware, in a route group, and asks for the order with this number and this customer, so anyone else's is 'no such order'. The log-in has no password, to keep the demo short.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh
curl -s -c ada.txt -d who=Ada localhost:8080/login
curl -s -b ada.txt localhost:8080/orders/41
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): an order's page by its number, for anyone
- this folder: a signed_in group, and the customer in the query
