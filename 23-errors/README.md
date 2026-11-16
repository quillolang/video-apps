# Bug Hunt: Errors as Values in Quillo (a Vending Machine)

Snack-o-matic, a vending machine where every failure is a value: no such slot, sold out, not enough money. The video starts from a broken copy with two bugs (an error that isn't text, and a dropped error that sells crisps for 50¢) and fixes them; this is the fixed one.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
