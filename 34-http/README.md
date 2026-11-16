# Calling Other Servers in Quillo: A Weather Dashboard That Copes

Sky watch: a weather dashboard that asks another server with http.get, caching answers for 30 seconds and giving up after 2, and shows what went wrong when a city is slow, unknown, or the whole service is down. weather.qwe is the pretend weather service it asks: run it with quillo run weather.qwe --port 8081.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
