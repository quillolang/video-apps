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
