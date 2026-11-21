# Five uploads, a gigabyte: what was run

`run-compare.sh` keeps each command and what it printed in `runs/`: the Express app (from a temp copy, installed from its lockfile)
without limits and with them, then the Quillo app, each sent files of zeros. `../make-video.py` checks the narration against the runs.

- **When:** 2026-11-21 15:35 +08
- **Machine:** Apple M5, 16 GB; macOS 26.7.1
- **Node:** 26.13.1 (LTS), from nodejs.org, with its npm 11.20.0
- **Quillo:** 0.8.8 (f35bf2d)

```
$ node --version && npm ls express multer | grep -E 'express@|multer@'
v26.13.1
├── express@5.3.0
└── multer@2.5.0

$ head -c 209715200 /dev/zero > big.jpg && head -c 3000000 /dev/zero > medium.jpg && head -c 500000 /dev/zero > photo.jpg && ls -lh *.jpg | awk '{ print $5, $9 }'
200M big.jpg
2.9M medium.jpg
488K photo.jpg

$ curl -s -F photo=@big.jpg localhost:3000/photos; echo
Saved 209715200 bytes

$ for i in 1 2 3 4; do curl -s -F photo=@big.jpg localhost:3000/photos; echo; done
Saved 209715200 bytes
Saved 209715200 bytes
Saved 209715200 bytes
Saved 209715200 bytes

$ du -sh uploads | awk '{ print $1, $2 }'
1.0G uploads

$ ls -lh note.json | awk '{ print $5, $9 }' && curl -s -o /dev/null -w '%{http_code}\n' -H 'content-type: application/json' --data-binary @note.json localhost:3000/notes
195K note.json
413

$ curl -s -w ' (%{http_code})\n' -F photo=@big.jpg localhost:3000/photos
Photos up to 2 MB (413)

$ curl -s -w ' (%{http_code})\n' -F photo=@medium.jpg localhost:3000/photos
Photos up to 2 MB (413)

$ curl -s -w ' (%{http_code})\n' -F photo=@photo.jpg localhost:3000/photos
Saved 500000 bytes (200)

$ ls uploads | wc -l | tr -d ' '
1

$ curl -s -w ' (%{http_code})\n' -F photo=@big.jpg localhost:8080/photos
request body too large
 (413)

$ curl -s -w ' (%{http_code})\n' -F photo=@medium.jpg localhost:8080/photos
Photos up to 2 MB (413)

$ curl -s -w ' (%{http_code})\n' -F photo=@photo.jpg localhost:8080/photos
Saved 500000 bytes (200)

$ ls uploads | wc -l | tr -d ' '
1

(the Quillo server's log)
quillo: 1 route listening on http://127.0.0.1:8080
POST /photos HTTP/1.1 -> 413 (request body too large)
POST /photos -> 413 (17.4ms)
POST /photos -> 200 (638.0ms)
quillo: stopping once the requests in progress are answered (again to stop now)

```
