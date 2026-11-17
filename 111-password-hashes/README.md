# Your API Is Sending Password Hashes. Look in the Network Tab

Dawn Runners' members page, in plain Node and in Quillo. In Node (node/server.mjs, on 8181), GET /api/members answers select * from node/club.db, so every member's email and password_hash goes to every visitor, though the page (node/public/index.html) shows only names and dates. In Quillo the same mistake (steps/v1: a server fn with select *) sends them too: in the page's HTML, which carries the component's state, and from the server fn's address, POST /_quillo/rpc/members. The fix (main.qwe): a Member record, { name, joined }, the server fn naming those two columns, and each row made a Member, which keeps only Member's fields. The members and their Argon2id hashes are made up (migrations/001_members.sql).

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8180                 # Quillo
sqlite3 node/club.db < migrations/001_members.sql
node node/server.mjs                 # Node, on 8181
curl -s localhost:8181/api/members
curl -s localhost:8180/_quillo/rpc/members -H 'content-type: application/json' -d '[]'
```

## The versions in the video

The video also shows the careless version first:

- [`steps/v1`](steps/v1): select * in the server fn: the hashes go in the page and in the server fn's answer
- this folder: the finished app
