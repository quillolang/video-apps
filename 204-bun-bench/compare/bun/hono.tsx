// The same five answers in Hono on Bun, the way Hono's guide writes routes; the page is Hono's JSX, which escapes.
//   bun bun/hono.tsx PORT [processes]     (more than one: that many processes sharing the port with reusePort)
/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { raw } from "hono/html";
import { Database } from "bun:sqlite";
import { fortunes, work } from "./fortunes.mjs";

type Fortune = { id: number; message: string };
const port = Number(process.argv[2] || 3000), procs = Number(process.argv[3] || 1);

function Page({ list }: { list: Fortune[] }) {
  const all = [...list, { id: 0, message: "Additional fortune added at request time." }];
  all.sort((a, b) => (a.message < b.message ? -1 : a.message > b.message ? 1 : 0));
  return (
    <>{raw("<!doctype html>")}<html>
      <head><title>Fortunes</title></head>
      <body><table>
        <tr><th>id</th><th>message</th></tr>
        {all.map((f) => <tr><td>{f.id}</td><td>{f.message}</td></tr>)}
      </table></body>
    </html></>
  );
}

if (procs > 1 && !process.env.BENCH_CHILD) {
  for (let i = 0; i < procs; i++) Bun.spawn([process.execPath, import.meta.path, String(port), "1"], { env: { ...process.env, BENCH_CHILD: "1" } });
} else {
  const fromDb = new Database(process.env.DB || "fortunes.db").query("select id, message from fortune");
  const app = new Hono();
  app.get("/text", (c) => c.text("Hello, World!"));
  app.get("/json", (c) => c.json({ message: "Hello, World!" }));
  app.get("/fortunes", (c) => c.html(<Page list={fortunes} />));
  app.get("/db", (c) => c.html(<Page list={fromDb.all() as Fortune[]} />));
  app.get("/compute", (c) => c.json({ total: work(10000) }));
  Bun.serve({ port, hostname: "127.0.0.1", reusePort: true, fetch: app.fetch });
}
