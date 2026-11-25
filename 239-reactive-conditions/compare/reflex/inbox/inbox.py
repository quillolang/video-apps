import reflex as rx


class State(rx.State):
    open: bool = False
    status: str = "loading"
    unread: int = 0
    joining: bool = False
    shown: bool = True

    @rx.event
    def flip_open(self):
        self.open = not self.open

    @rx.event
    def set_status(self, s: str):
        self.status = s

    @rx.event
    def add_unread(self):
        self.unread += 1

    @rx.event
    def read_all(self):
        self.unread = 0

    @rx.event
    def flip_joining(self):
        self.joining = not self.joining

    @rx.event
    def flip_shown(self):
        self.shown = not self.shown


class Counter(rx.ComponentState):
    n: int = 0

    @rx.event
    def add(self):
        self.n += 1

    @classmethod
    def get_component(cls, **props):
        return rx.el.div(
            rx.el.span("Clicked ", cls.n, class_name="count"),
            rx.el.button("+1", on_click=cls.add),
            class_name="panel",
        )


def index() -> rx.Component:
    return rx.el.main(
        rx.el.h1("Reflex"),
        rx.el.section(
            rx.el.h2("Details"),
            rx.el.button(rx.cond(State.open, "Hide details", "Show details"), on_click=State.flip_open),
            rx.cond(State.open, rx.el.p("Ships in 2 days.", class_name="out")),
            class_name="box box-details",
        ),
        rx.el.section(
            rx.el.h2("Status"),
            rx.el.button("Loading", on_click=State.set_status("loading")),
            rx.el.button("Error", on_click=State.set_status("error")),
            rx.el.button("Ready", on_click=State.set_status("ready")),
            rx.el.p(
                rx.match(
                    State.status,
                    ("loading", rx.el.em("Loading…")),
                    ("error", rx.el.strong("Couldn't load")),
                    rx.el.span("3 messages"),
                ),
                class_name="out",
            ),
            class_name="box box-status",
        ),
        rx.el.section(
            rx.el.h2("Unread"),
            rx.el.button("+1 unread", on_click=State.add_unread),
            rx.el.button("Read all", on_click=State.read_all),
            rx.el.p(
                "Inbox",
                rx.cond(State.unread > 0, rx.el.span(State.unread, " new", class_name="badge")),
                class_name="out",
            ),
            class_name="box box-zero",
        ),
        rx.el.section(
            rx.el.h2("Log in or sign up"),
            rx.el.button(rx.cond(State.joining, "I have an account", "I'm new here"), on_click=State.flip_joining),
            rx.cond(
                State.joining,
                rx.el.input(placeholder="Work email", aria_label="Work email"),
                rx.el.input(placeholder="Your email", aria_label="Your email"),
            ),
            class_name="box box-switch wide",
        ),
        rx.el.section(
            rx.el.h2("Counter"),
            rx.el.button(rx.cond(State.shown, "Hide counter", "Show counter"), on_click=State.flip_shown),
            rx.cond(State.shown, Counter.create()),
            class_name="box box-keep",
        ),
    )


app = rx.App(stylesheets=["/page.css"])
app.add_page(index, title="Reflex")
