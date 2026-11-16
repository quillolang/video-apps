# Bug Hunt: Ten Mistakes, One Command (quillo check)

The little library: three books to borrow and return. The video starts from a version with ten mistakes, most of them JavaScript habits, and fixes each one quillo check finds. That version is in bug-hunt/: run sh get-quillo.sh once, then cd bug-hunt and ../.quillo/bin/quillo check, and see how many you spot first. main.qwe is the fixed program.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
