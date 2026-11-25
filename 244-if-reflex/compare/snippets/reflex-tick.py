def toggle(self):
    self.running = not self.running
    if self.running:
        return State.tick
# ...
async def tick(self):
    while True:
        async with self:
            if not self.running:
                return
            self.ticks += 1
            ms = self.speed
        await asyncio.sleep(ms / 1000)
# ...
rx.cond(State.running, rx.el.input(placeholder="A note, while it runs", aria_label="Note")),
