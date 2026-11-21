# 1 GB From Five Uploads: multer With No Limits, Express's 100 kB, and Quillo's 10 MB

The trail club's photo upload, for the video about upload and body limits: app/ in Quillo (POST /photos: 10 MB a request by default, and the route's own 2 MB check). compare/express is the same upload in Express 5.3.0 with multer 2.5.0: versions/server.v1.js as multer's README starts (no limits), server.v2.js with limits.fileSize and a 413 (server.js is that one); compare/run-compare.sh sends files of zeros to both. For updates, see the official sites: https://expressjs.com, https://github.com/expressjs/multer and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                               # the upload: POST http://127.0.0.1:8080/photos
curl -F photo=@photo.jpg localhost:8080/photos

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd
curl.exe -F photo=@photo.jpg localhost:8080/photos
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
