# Which Fruit Are You? Vectors and Cosine Similarity in Quillo

Which fruit are you? Five sliders make a vector of answers, and the fruit whose answers point the most the same way, by cosine similarity (vec.dot over vec.norm), is yours. It's all worked out in the browser as you slide; vec.argsort ranks the fruits.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
