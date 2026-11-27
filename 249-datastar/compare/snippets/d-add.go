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
