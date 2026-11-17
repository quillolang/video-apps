# A Full-Stack Starter Took Almost 8 Minutes. Quillo's Took 4.6 Seconds

The race in this video: two starters, each from nothing to a page that answers, cold, as on a new machine. The Epic Stack (github.com/epicweb-dev/epic-stack), with its getting-started guide's npx epicli new, then npm run dev; and the Quillo starter (github.com/quillolang/starter), with its README's git clone, git init, get-quillo.sh spa and run.sh --watch. This folder is the starter's spa sample as get-quillo.sh spa leaves it. compare/measure.py is what timed them, and compare/MEASURE.md has every command, its output, the machine and the numbers.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                          # the spa sample, on 8080
python3 compare/measure.py /tmp/race both # the race again, on your machine (it downloads about 2 GB, then deletes it)
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
