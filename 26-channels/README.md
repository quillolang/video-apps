# Real Time with Channels in Quillo: A Live Emoji Reaction Wall

Cheers!, a talk's live reaction wall: tap an emoji and it floats up on every open page. The server counts with channel.on and channel.broadcast, join and leave keep a count of who's watching, and each page listens with channel.open.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
