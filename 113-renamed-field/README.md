# The Backend Renamed One Field. The Frontend Found Out in Production

The Book Nook's shelf, in plain Node and in Quillo. In Node, node/server.mjs answers GET /api/books with select * from node/shop.db, and node/public/index.html fetches it and shows `${book.title}, by ${book.author}`: rename the column (sqlite3 node/shop.db "alter table books rename column title to name") and every line says undefined, with no error anywhere. In Quillo, main.qwe is one program: a Book record, a server fn that gives the rows as Books, and a component that shows them. steps/v1 is before the rename; steps/v2 renames the column (migrations/002_rename.sql) and the type's field, and quillo check says main.qwe:15: error: this map has no field `title` (it has author, id, name), and quillo run won't start it; app/ has the component fixed. steps/forgot runs the migration but keeps the type's title: Book(row) refuses the rows, and the page is a 500 with line 15 in the log.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                      # Quillo, on 8080
sqlite3 node/shop.db < migrations/001_books.sql
node node/server.mjs          # Node, on 8081
sqlite3 node/shop.db "alter table books rename column title to name"
```

## The versions in the video

The video also shows the versions along the way (`cd steps/v2 && quillo check`):

- [`steps/v1`](steps/v1): before the rename: title everywhere
- [`steps/v2`](steps/v2): the column and the type renamed, the component not: quillo check finds line 15
- [`steps/forgot`](steps/forgot): the column renamed, the type not: a 500, with line 15 in the log
- this folder: the finished app
