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
