# Ship It: Taking a Quillo App from Your Laptop to a Server

Shortlinks: short codes for long addresses, ready for a server of its own. deploy/ has a systemd unit, a Caddyfile for HTTPS in front, and the environment file's one line (QUILLO_SECRET).

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
