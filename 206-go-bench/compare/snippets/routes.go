	mux := http.NewServeMux()
	mux.HandleFunc("GET /text", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write([]byte("Hello, World!"))
	})
	mux.HandleFunc("GET /json", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]string{"message": "Hello, World!"})
	})
	mux.HandleFunc("GET /fortunes", func(w http.ResponseWriter, r *http.Request) {
