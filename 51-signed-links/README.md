# Signed Links: Party Invites Nobody Can Forge (crypto.hmac in Quillo)

Garden party invites nobody can forge: each link carries the guest's name, the last day it works, and an HMAC signature made with a key only the server knows (INVITE_KEY). Open /host for the links.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
