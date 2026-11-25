rx.match(
    State.status,
    ("loading", rx.el.em("Loading…")),
    ("error", rx.el.strong("Couldn't load")),
    rx.el.span("3 messages"),
),
