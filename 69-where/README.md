# Where Does This Line Run? A Quillo Quiz: Server, Browser, or Both?

Lucky Draw: a village fête's raffle with a print on every kind of line, to see where each one runs. The top of the file, the route and the view print in the terminal; the component's body prints in both (the server makes the page, the browser wakes it up); the ticket, a state, is drawn once on the server; the click prints in the browser's console; and draw_prize, a server fn, on the server. The video also tries platform() in the component (refused) and the ticket as a let (drawn again in the browser).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
