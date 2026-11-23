// Bun.serve with its routes table: the five answers, with no framework.
//   bun bun/serve.ts PORT [processes]     (more than one: that many processes sharing the port with reusePort)
import { Database } from "bun:sqlite";
import { fortunes, fortunesPage, work } from "./fortunes.mjs";

const port = Number(process.argv[2] || 3000), procs = Number(process.argv[3] || 1);
if (procs > 1 && !process.env.BENCH_CHILD) {
  for (let i = 0; i < procs; i++) Bun.spawn([process.execPath, import.meta.path, String(port), "1"], { env: { ...process.env, BENCH_CHILD: "1" } });
} else {
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
}
