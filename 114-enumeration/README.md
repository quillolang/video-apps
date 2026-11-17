# Your Log-In Page Tells Hackers Who Has an Account (Enumeration, Fixed)

Crumbs bakery's club log-in, three ways. node/v1/server.mjs (plain Node, scrypt from node:crypto) answers "No such user" or "Wrong password", so ask.sh, which logs in to six addresses with a wrong password, lists who has an account. node/v2/server.mjs gives one message, "Wrong email or password", but returns before hashing when there's no such user, so probe.mjs, which times 20 rounds of tries, still tells the members (tens of milliseconds) from the rest (a few). main.qwe, in Quillo, gives one message and does the same work either way: for a missing user it hashes another password with crypto.hash_password, which takes as long as crypto.verify_password on a real hash (Argon2id). The members (Ada: sourdough-42, Sam: croissant!, Kim: rye-and-honey) come from migrations/002_members.sql.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                     # Quillo, on 8080
node node/v1/server.mjs      # Node, two messages, on 8081
node node/v2/server.mjs      # Node, one message, on 8081
sh ask.sh 8081               # what the log-in says to six addresses
node probe.mjs 8081          # how long it takes for each
```
