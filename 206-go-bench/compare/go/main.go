// The five answers in Go's standard library: net/http's ServeMux, encoding/json, html/template (which escapes), and
// database/sql with modernc.org/sqlite (SQLite in pure Go, no C compiler needed).
//
//	go build -o server . && PORT=3000 ./server      (GOMAXPROCS=1 keeps it to one core)
package main

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"sort"

	_ "modernc.org/sqlite"
)

type Fortune struct {
	ID      int
	Message string
}

var fortunes = []Fortune{
	{1, "fortune: No such file or directory"},
	{2, "A computer scientist is someone who fixes things that aren't broken."},
	{3, "After enough decimal places, nobody gives a damn."},
	{4, "A bad random number generator: 1, 1, 1, 1, 1, 4.33e+67, 1, 1, 1"},
	{5, "A computer program does what you tell it to do, not what you want it to do."},
	{6, "Emacs is a nice operating system, but I prefer UNIX. — Tom Christaensen"},
	{7, "Any program that runs right is obsolete."},
	{8, "A list is only as strong as its weakest link. — Donald Knuth"},
	{9, "Feature: A bug with seniority."},
	{10, "Computers make very fast, very accurate mistakes."},
	{11, `<script>alert("This should not be displayed in a browser alert box.");</script>`},
	{12, "フレームワークのベンチマーク"},
}

var page = template.Must(template.New("fortunes").Parse(
	`<!doctype html><html><head><title>Fortunes</title></head><body><table><tr><th>id</th><th>message</th></tr>` +
		`{{range .}}<tr><td>{{.ID}}</td><td>{{.Message}}</td></tr>{{end}}</table></body></html>`))

// The list, one more added for this request, sorted, as the page.
func fortunesPage(w http.ResponseWriter, list []Fortune) {
	all := append(append([]Fortune{}, list...), Fortune{0, "Additional fortune added at request time."})
	sort.Slice(all, func(i, j int) bool { return all[i].Message < all[j].Message })
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	page.Execute(w, all)
}

func work(n int) int {
	total := 0
	for i := 0; i < n; i++ {
		total = (total + i*i) % 1000003
	}
	return total
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func main() {
	db, err := sql.Open("sqlite", os.Getenv("DB"))
	if err != nil {
		log.Fatal(err)
	}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /text", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write([]byte("Hello, World!"))
	})
	mux.HandleFunc("GET /json", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]string{"message": "Hello, World!"})
	})
	mux.HandleFunc("GET /fortunes", func(w http.ResponseWriter, r *http.Request) {
		fortunesPage(w, fortunes)
	})
	mux.HandleFunc("GET /db", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("select id, message from fortune")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()
		var list []Fortune
		for rows.Next() {
			var f Fortune
			rows.Scan(&f.ID, &f.Message)
			list = append(list, f)
		}
		fortunesPage(w, list)
	})
	mux.HandleFunc("GET /compute", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]int{"total": work(10000)})
	})
	log.Fatal(http.ListenAndServe("127.0.0.1:"+os.Getenv("PORT"), mux))
}
