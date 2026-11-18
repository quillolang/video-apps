// The bakery's hit counter, with an atomic count: two visits at once both count.
package main

import (
	"fmt"
	"net/http"
	"sync/atomic"
)

var hits atomic.Int64

func main() {
	http.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		n := hits.Add(1)
		fmt.Fprintf(w, "Welcome! You're visitor number %d.\n", n)
	})
	http.HandleFunc("GET /hits", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "%d\n", hits.Load())
	})
	http.ListenAndServe(":8090", nil)
}
