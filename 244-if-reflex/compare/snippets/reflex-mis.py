async def tick(self):
    while True:
        if not self.running:
            return
        self.ticks += 1
        ms = self.speed
        await asyncio.sleep(ms / 1000)
