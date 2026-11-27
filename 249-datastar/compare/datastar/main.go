// A shared shopping list with Datastar: add, tick off, hide what's done, live in every open tab.
package main

import (
	"bytes"
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/starfederation/datastar-go/datastar"
	_ "modernc.org/sqlite"
)

type Item struct {
	ID   int
	Name string
	Done bool
}

var db *sql.DB

var page = template.Must(template.New("page").Parse(`<!doctype html>
<html><head><meta charset="utf-8"><title>Shopping list</title>
<script type="module" src="/static/datastar.js"></script>
<style>body { font: 18px system-ui; margin: 24px } li { list-style: none } .problem { color: #c0392b }</style></head>
<body>
<main data-signals="{item: '', problem: '', hideDone: false}" data-init="@get('/updates')">
  <h1>Shopping list</h1>
  <form data-on:submit="@post('/add')">
    <input data-bind:item placeholder="Milk, eggs..." aria-label="New item">
    <button>Add</button>
  </form>
  <p class="problem" data-show="$problem != ''" data-text="$problem"></p>
  <label><input type="checkbox" data-bind:hide-done> Hide done</label>
  {{template "list" .}}
</main>
</body></html>
{{define "list"}}<div id="list">
  <p>{{.Left}} left</p>
  <ul>{{range .Items}}
    <li {{if .Done}}data-show="!$hideDone"{{end}}><label>
      <input type="checkbox" {{if .Done}}checked{{end}} data-on:change="@post('/toggle?id={{.ID}}')"> {{.Name}}
    </label></li>{{end}}
  </ul>
</div>{{end}}`))

type listData struct {
	Items []Item
	Left  int
}

func load() listData {
	rows, err := db.Query("select id, name, done from items order by id")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	d := listData{}
	for rows.Next() {
		var it Item
		rows.Scan(&it.ID, &it.Name, &it.Done)
		d.Items = append(d.Items, it)
		if !it.Done {
			d.Left++
		}
	}
	return d
}

func renderList() string {
	var b bytes.Buffer
	page.ExecuteTemplate(&b, "list", load())
	return b.String()
}

// Every open page holds a /updates stream; a change wakes each one.
var (
	mu      sync.Mutex
	streams = map[chan struct{}]bool{}
)

func changed() {
	mu.Lock()
	defer mu.Unlock()
	for ch := range streams {
		select {
		case ch <- struct{}{}:
		default:
		}
	}
}

func updates(w http.ResponseWriter, r *http.Request) {
	ch := make(chan struct{}, 1)
	mu.Lock()
	streams[ch] = true
	mu.Unlock()
	defer func() { mu.Lock(); delete(streams, ch); mu.Unlock() }()

	sse := datastar.NewSSE(w, r)
	sse.PatchElements(renderList())
	for {
		select {
		case <-sse.Context().Done():
			return
		case <-ch:
			sse.PatchElements(renderList())
		}
	}
}

func add(w http.ResponseWriter, r *http.Request) {
	var signals struct {
		Item string `json:"item"`
	}
	if err := datastar.ReadSignals(r, &signals); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	sse := datastar.NewSSE(w, r)
	name := strings.TrimSpace(signals.Item)
	if name == "" {
		sse.MarshalAndPatchSignals(map[string]any{"problem": "Type something to add"})
		return
	}
	if len([]rune(name)) > 40 {
		sse.MarshalAndPatchSignals(map[string]any{"problem": "40 characters at most"})
		return
	}
	if _, err := db.Exec("insert into items (name) values (?)", name); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sse.MarshalAndPatchSignals(map[string]any{"item": "", "problem": ""})
	changed()
}

func toggle(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}
	if _, err := db.Exec("update items set done = 1 - done where id = ?", id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	changed()
}

func main() {
	var err error
	db, err = sql.Open("sqlite", "list.db")
	if err != nil {
		log.Fatal(err)
	}
	db.SetMaxOpenConns(1)
	if _, err := db.Exec(`create table if not exists items (
		id integer primary key, name text not null, done integer not null default 0)`); err != nil {
		log.Fatal(err)
	}

	http.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) { page.Execute(w, load()) })
	http.HandleFunc("GET /updates", updates)
	http.HandleFunc("POST /add", add)
	http.HandleFunc("POST /toggle", toggle)

	addr := "127.0.0.1:8190"
	log.Println("listening on http://" + addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
