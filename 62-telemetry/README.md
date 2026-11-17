# Weather Stations over UDP: a Live Dashboard in Quillo (udp.listen, udp.send)

A weather board that takes readings over UDP: udp.listen on port 9000, a match pattern to check each packet is a reading, udp.reply to answer ok, and live to show every reading on every open page as it lands. stations.qwe is three pretend stations, sending a reading a second each with udp.send.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
