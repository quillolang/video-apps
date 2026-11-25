rx.cond(
    State.joining,
    rx.el.input(placeholder="Work email", aria_label="Work email"),
    rx.el.input(placeholder="Your email", aria_label="Your email"),
),
