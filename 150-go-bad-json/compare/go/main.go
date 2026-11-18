// Sign-ups for the bake sale: who's coming, and how many guests. The body must be a sign-up and nothing else, every
// field must be there, and the rules hold.
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"
)

type Signup struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Guests *int   `json:"guests"`
}

var (
	mu      sync.Mutex
	signups = []Signup{}
	email   = regexp.MustCompile(`^[^@ ]+@[^@ ]+\.[^@ ]+$`)
)

// What the struct can't say: plain rules, each giving its problems.
func problems(s Signup) []string {
	bad := []string{}
	if strings.TrimSpace(s.Name) == "" {
		bad = append(bad, "name: empty")
	}
	if !email.MatchString(s.Email) {
		bad = append(bad, "email: not an email address")
	}
	if s.Guests == nil {
		bad = append(bad, "guests: missing")
	} else if *s.Guests < 0 || *s.Guests > 8 {
		bad = append(bad, "guests: from 0 to 8")
	}
	return bad
}

func main() {
	http.HandleFunc("POST /api/signups", func(w http.ResponseWriter, r *http.Request) {
		var s Signup
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()
		if err := dec.Decode(&s); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if bad := problems(s); len(bad) > 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string][]string{"errors": bad})
			return
		}
		mu.Lock()
		signups = append(signups, s)
		mu.Unlock()
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(s)
	})
	http.HandleFunc("GET /api/signups", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		defer mu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(signups)
	})
	log.Fatal(http.ListenAndServe(":8090", nil))
}
