# From 30 Seconds to 100 ms: Compiled Numbers in Quillo (a Mandelbrot Poster)

A Mandelbrot poster: 225,000 pixels, each the rounds of z = z² + c it takes to escape, painted on a canvas in the browser. Written first with complex numbers as maps (29.9 seconds), then in plain floats, which Quillo compiles to machine code (100 ms). With QUILLO_JIT=0, the same floats take 5.6 seconds.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
