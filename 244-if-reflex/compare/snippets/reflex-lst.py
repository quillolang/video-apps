def shown(self) -> list[dict]:
    return [t for t in TODOS if self.show_done or not t["done"]]
# ...
rx.el.ul(rx.foreach(State.shown, lambda t: rx.el.li(t["text"], key=t["id"]))),
