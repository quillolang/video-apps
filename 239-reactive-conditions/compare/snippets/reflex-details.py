rx.el.section(
    rx.el.h2("Details"),
    rx.el.button(rx.cond(State.open, "Hide details", "Show details"), on_click=State.flip_open),
    rx.cond(State.open, rx.el.p("Ships in 2 days.", class_name="out")),
    class_name="box box-details",
),
