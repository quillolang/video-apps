# A Million Rows in One Page? What Happens, and the Virtual List That Fixes It (Quillo)

A town phone book of a million entries. Put them all in one page and it's 55 MB of HTML; this one is a virtual list: a tall empty track for the scrollbar, the scroll position as a fraction picks the first entry, and a server fn sends the sixteen on screen. The entries are made up by entry(i); a real book would come from a database the same way.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
