  const fromDb = new Database(process.env.DB || "fortunes.db").query("select id, message from fortune");
  const app = new Hono();
  app.get("/text", (c) => c.text("Hello, World!"));
  app.get("/json", (c) => c.json({ message: "Hello, World!" }));
  app.get("/fortunes", (c) => c.html(<Page list={fortunes} />));
  app.get("/db", (c) => c.html(<Page list={fromDb.all() as Fortune[]} />));
  app.get("/compute", (c) => c.json({ total: work(10000) }));
  Bun.serve({ port, hostname: "127.0.0.1", reusePort: true, fetch: app.fetch });
