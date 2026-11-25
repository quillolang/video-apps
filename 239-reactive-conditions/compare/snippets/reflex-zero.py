"Inbox",
rx.cond(State.unread > 0, rx.el.span(State.unread, " new", class_name="badge")),
