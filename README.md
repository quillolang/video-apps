# Quillo video apps

The sample apps from the [@quillolang](https://www.youtube.com/@quillolang) videos on YouTube, one folder per video.
Each runs with `./run.sh --watch` in its folder (it downloads the Quillo it was written for), then http://127.0.0.1:8080.

Quillo: https://quillolang.org

| Folder | Video | The app |
|---|---|---|
| [01-live-wall](01-live-wall) | A Live Full-Stack App in 50 Lines of Quillo | A live message wall: post in one tab, and every open tab shows it. One file, about 50 lines. |
| [02-crud-notes](02-crud-notes) | Build a Full CRUD App with Quillo: Notes, Live in Every Tab | A notes app: add, edit and delete notes, with validation, live in every open tab, and a JSON API. |
| [03-starter-app](03-starter-app) | A Tour of the Quillo Starter App (quillo new) | The to-do app `quillo new` makes, with the first change from the video: a Clear done button. |
| [04-composition](04-composition) | Components and Views in Quillo: Composing a Page | A café menu made of views and components: a frame, cards, a Stepper, and an order every card shares. |
| [05-reactivity](05-reactivity) | Reactivity in Quillo: State, Page State and live() | A focus board: a timer and a checklist with their own state, a focus switch in page state, and today's sessions, live for everyone. |
| [06-spa](06-spa) | A Single-Page App in Quillo: Links, url() and match | A recipe book as a single-page app: pages that change without reloading, a page per recipe at its own address, favourites kept while you move around, and real 404s. |
| [07-forms](07-forms) | Forms and Validation in Quillo: Typed Routes, 422s and Live Hints | A workshop sign-up: a plain form, a typed route that refuses the wrong shape, friendly messages for each field, seats counted in the database, and the same rules as hints while you type. |
| [08-hot-reload](08-hot-reload) | Hot Reload in Quillo: Edit While It Runs, Keep Your State | A game-night scoreboard to edit while it runs: two Score components, a Cheer button counted on the server, and a notes field. Run it with --watch, change it, and see what each save keeps. |
| [09-routes](09-routes) | Routes and Route Groups in Quillo: Params, Prefixes and Middleware | A little bookshop: pages found by typed routes, a JSON API in a routes group with a nested group inside, and an admin area behind middleware that sends you to log in first. |
| [10-split](10-split) | From Monolith to Services in Quillo: One Program, --split | A bakery that starts as one program, then moves its billing into a service: the same code runs in one process, or split into processes with --split, --scale and --watch, or on two servers with --service-url. |
| [11-project-structure](11-project-structure) | Project Structure in Quillo: One File to Many, use and import | A plant care list, split the way bigger programs are: main.qwe lists the parts, lib/ holds the helpers and server fns, ui/ the views and components, migrations/ the tables, data/ the database and public/ the files served as they are. |
| [12-state-let](12-state-let) | State vs let in Quillo: What Changes, What Follows, What's Shared | A tip splitter: what you change is state, what follows from it is let, and a top-level let on the server holds the tips paid, shared by every visitor until a restart. |
| [13-databases](13-databases) | Databases in Quillo: Migrations, Queries, Transactions and Live Pages | A team kudos board in SQLite: tables from migrations, queries with ? and :name values, rows checked against a record type, a unique name said plainly with db.error_kind, kudos given in a transaction that's all or nothing, and a board that follows the database live. |
| [14-request-response](14-request-response) | Request and Response in Quillo: What Comes In, What Goes Out | Snippets, a tiny API: one route that echoes what a request holds, and routes that answer with text, HTML, JSON with an etag (and a 304), 201 with a location, 204, a 301 redirect, and an error value's 500. |

## Shorts

| Folder | Short | The app |
|---|---|---|
| [01-counter](shorts/01-counter) | A click counter in 12 lines of Quillo | A click counter: a component with its own state, and a route that puts it on a page. One file, 12 lines. |
