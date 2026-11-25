rx.match(
    State.unread,
    (0, rx.el.span("All read")),
    (1, rx.el.span("1 new message")),
    rx.el.strong(State.unread, " new messages"),
),
