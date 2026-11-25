import asyncio

import reflex as rx

TODOS = [
    {"id": 1, "text": "Milk", "done": True},
    {"id": 2, "text": "Bread", "done": False},
    {"id": 3, "text": "Eggs", "done": False},
]


class State(rx.State):
    unread: int = 0
    running: bool = False
    speed: int = 100
    ticks: int = 0
    show_done: bool = False
    joining: bool = False

    @rx.var
    def shown(self) -> list[dict]:
        return [t for t in TODOS if self.show_done or not t["done"]]

    @rx.event
    def add_unread(self):
        self.unread += 1

    @rx.event
    def read_all(self):
        self.unread = 0

    @rx.event
    def toggle(self):
        self.running = not self.running
        if self.running:
            return State.tick

    @rx.event
    def faster(self):
        self.speed = self.speed // 2

    @rx.event(background=True)
    async def tick(self):
        while True:
            if not self.running:
                return
            self.ticks += 1
            ms = self.speed
            await asyncio.sleep(ms / 1000)

    @rx.event
    def set_show_done(self, value: bool):
        self.show_done = value

    @rx.event
    def flip_joining(self):
        self.joining = not self.joining


def index() -> rx.Component:
    return rx.el.main(
        rx.el.h1("Reflex"),
        rx.el.section(
            rx.el.h2("Unread"),
            rx.el.button("+1 unread", on_click=State.add_unread),
            rx.el.button("Read all", on_click=State.read_all),
            rx.el.p(
                rx.match(
                    State.unread,
                    (0, rx.el.span("All read")),
                    (1, rx.el.span("1 new message")),
                    rx.el.strong(State.unread, " new messages"),
                ),
                class_name="out",
            ),
            class_name="box box-if",
        ),
        rx.el.section(
            rx.el.h2("Ticker"),
            rx.el.button(rx.cond(State.running, "Stop", "Start"), on_click=State.toggle),
            rx.el.button("Faster", on_click=State.faster),
            rx.el.p(State.ticks, " ticks", class_name="out"),
            rx.cond(State.running, rx.el.input(placeholder="A note, while it runs", aria_label="Note")),
            class_name="box box-timer",
        ),
        rx.el.section(
            rx.el.h2("Shopping"),
            rx.el.label(
                rx.el.input(type="checkbox", checked=State.show_done, on_change=State.set_show_done),
                " Show done",
            ),
            rx.el.ul(rx.foreach(State.shown, lambda t: rx.el.li(t["text"], key=t["id"]))),
            class_name="box box-list",
        ),
        rx.el.section(
            rx.el.h2("Log in or sign up"),
            rx.el.button(rx.cond(State.joining, "I have an account", "I'm new here"), on_click=State.flip_joining),
            rx.el.input(placeholder=rx.cond(State.joining, "Work email", "Your email"), aria_label="Email"),
            class_name="box box-one",
        ),
    )


app = rx.App(stylesheets=["/page.css"])
app.add_page(index, title="Reflex")
