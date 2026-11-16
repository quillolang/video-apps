# Bug Hunt: Passwords Done Right (and the Tempting Fix That Isn't)

Seed Swap: a garden club's sign-up and log-in, with passwords kept the right way: crypto.hash_password (salted Argon2id) and crypto.verify_password, one message for a wrong email or password, and the same work whether or not the member exists. The video starts from a version that keeps them in plain text, then tries SHA-256.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
