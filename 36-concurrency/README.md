# Concurrency in Quillo: 100 Tickets, 300 Fans, No Seat Sold Twice

Gig tickets: 100 seats and a rush of buyers, and not one seat sold twice. Paying is a wait; after it, the program looks again and takes a seat with no wait in between, since one handler runs at a time between waits. The video also shows a version that writes back a count read before the wait, and oversells.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
