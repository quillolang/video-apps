# Cannot Read Properties of Undefined: Four Values That Break Your UI

A club member's card, from an API (node/server.mjs, on 8081) where Ada's profile is complete and Bob's isn't: no name yet, no address, a $0 balance and 0 unread messages. The plain JavaScript card (js/v1.html at /v1) throws on user.address.city, and with ?. (js/v2.html at /v2) says Lives in undefined, Balance: $N/A, and a stray 0. In Quillo (main.qwe, on 8080) a field of null is null, ?? gives a default, filled() turns a blank name into null, and since 0 and "" are true, quillo check warns about || and && on numbers (steps/careless, the card written the JavaScript way).

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
node node/server.mjs      # the API, and the JavaScript card at /v1?user=bob and /v2?user=bob
./run.sh                  # Quillo's card, on 8080: /?user=bob
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/careless`](steps/careless): the card written the JavaScript way: no crash, and quillo check warns twice
- this folder: the finished app
