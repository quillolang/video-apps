# File Uploads in Quillo: Build a Pet Photo Wall

Pet wall: visitors upload photos of their pets with a multipart form. The route checks the kind and size again, saves each file under a name it makes with save_upload, keeps the captions in SQLite, and serves the photos with files().

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
