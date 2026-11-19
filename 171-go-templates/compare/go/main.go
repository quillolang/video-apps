// Trail Club's notes board in Go, with html/template: a visitor leaves a note (a name, a text, a link and a color),
// and the page shows them all in one layout. html/template escapes each value for the place it goes.
package main

import (
	"html/template"
	"net/http"
	"sync"
)

type Note struct{ Name, Text, Link, Color string }

var (
	mu    sync.Mutex
	notes []Note
	page  = template.Must(template.ParseFiles("templates/layout.html", "templates/board.html"))
)

func board(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()
	latest := ""
	if len(notes) > 0 {
		latest = notes[len(notes)-1].Name
	}
	page.ExecuteTemplate(w, "layout", map[string]any{"Notes": notes, "Latest": latest})
}

func add(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	notes = append(notes, Note{r.FormValue("name"), r.FormValue("text"), r.FormValue("link"), r.FormValue("color")})
	mu.Unlock()
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func main() {
	http.HandleFunc("GET /{$}", board)
	http.HandleFunc("POST /notes", add)
	http.ListenAndServe(":8160", nil)
}
