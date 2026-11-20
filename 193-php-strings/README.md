# PHP 8.6 Quirks #3: "Zoë" Becomes "Zo?", a Door That Opens for 1e3, and 3 More

PHP 8.6 Quirks #3: five PHP string and number quirks, each as a plain PHP page or API (compare/php: badge.php, dessert.php, username.php, door.php, total.php, and each one's fix), served by PHP 8.6's built-in server (with mbstring; on Windows, turn it on in php.ini with extension=mbstring), and the same five in Quillo (main.qwe, at /badge, /dessert, /username, /door, /api/total and /api/total-float). For updates, see the official sites: https://www.php.net and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                          # the Quillo pages: http://127.0.0.1:8080/badge
cd compare/php && php -S localhost:8000   # the PHP pages: http://localhost:8000/badge.php

# On Windows, in PowerShell, in this folder (PHP from https://windows.php.net/download/; in php.ini: extension=mbstring):
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
cd compare\php; php -S localhost:8000
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
