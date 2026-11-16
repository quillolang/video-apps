# A Chat App in One File: Sessions, a Database and Live Channels in Quillo

Campfire: a chat in one file. Your name lives in the session (a signed cookie), the messages in SQLite, and new ones travel live on a channel; whoever sits down gets the last fifty messages from the database.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
