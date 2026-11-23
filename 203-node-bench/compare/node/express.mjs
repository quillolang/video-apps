// The same five answers in Express 5, the way its guide writes routes.
//   node node/express.mjs PORT [processes]     (more than one process: Node's cluster module)
import express from "express";
import cluster from "node:cluster";
import { DatabaseSync } from "node:sqlite";
import { fortunes, fortunesPage, work } from "./fortunes.mjs";

const port = Number(process.argv[2] || 3000), procs = Number(process.argv[3] || 1);
if (procs > 1 && cluster.isPrimary) {
  for (let i = 0; i < procs; i++) cluster.fork();
} else {
  const fromDb = new DatabaseSync(process.env.DB || "fortunes.db").prepare("select id, message from fortune");
  const app = express();
  app.get("/text", (req, res) => res.type("text/plain").send("Hello, World!"));
  app.get("/json", (req, res) => res.json({ message: "Hello, World!" }));
  app.get("/fortunes", (req, res) => res.send(fortunesPage(fortunes)));
  app.get("/db", (req, res) => res.send(fortunesPage(fromDb.all())));
  app.get("/compute", (req, res) => res.json({ total: work(10000) }));
  app.listen(port, "127.0.0.1");
}
