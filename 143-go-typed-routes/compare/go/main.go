// Trail Guide: a page for each trail, at /trails/<its number>.
package main

import (
	"embed"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Trail struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Km    float64 `json:"km"`
	Climb int     `json:"climb"`
	Level string  `json:"level"`
}

//go:embed templates/*.html
var files embed.FS

var pages = template.Must(template.ParseFS(files, "templates/*.html"))

func main() {
	data, err := os.ReadFile("trails.json")
	if err != nil {
		log.Fatal(err)
	}
	var trails []Trail
	if err := json.Unmarshal(data, &trails); err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		pages.ExecuteTemplate(w, "home.html", trails)
	})
	mux.HandleFunc("GET /trails/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			missing(w, "No such page")
			return
		}
		for _, t := range trails {
			if t.ID == id {
				pages.ExecuteTemplate(w, "trail.html", t)
				return
			}
		}
		missing(w, "No such trail")
	})
	mux.HandleFunc("GET /trails.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "trails.css")
	})
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		missing(w, "No such page")
	})
	log.Fatal(http.ListenAndServe(":8090", mux))
}

// A 404 with the site's own page.
func missing(w http.ResponseWriter, what string) {
	w.WriteHeader(http.StatusNotFound)
	pages.ExecuteTemplate(w, "missing.html", what)
}
