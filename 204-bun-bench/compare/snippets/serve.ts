  const fromDb = new Database(process.env.DB || "fortunes.db").query("select id, message from fortune");
  const html = (body: string) => new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  Bun.serve({
    port, hostname: "127.0.0.1", reusePort: true,
    routes: {
      "/text": new Response("Hello, World!", { headers: { "Content-Type": "text/plain; charset=utf-8" } }),
      "/json": () => Response.json({ message: "Hello, World!" }),
      "/fortunes": () => html(fortunesPage(fortunes)),
      "/db": () => html(fortunesPage(fromDb.all() as any)),
      "/compute": () => Response.json({ total: work(10000) }),
    },
    fetch: () => new Response(null, { status: 404 }),
  });
