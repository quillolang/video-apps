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
