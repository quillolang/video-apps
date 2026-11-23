// dioxus-server 0.7.10, src/server.rs: the pool every page render uses
let rt = LocalPoolHandle::new(
    std::thread::available_parallelism()
        .map(usize::from)
        .unwrap_or(1),
);

// src/serverfn.rs: each server function call goes onto it too
// Allow !Send futures by running in the render handlers pinned local pool
let result = state.rt.spawn_pinned(move || async move {
