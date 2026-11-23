  const fromDb = new DatabaseSync(process.env.DB || "fortunes.db").prepare("select id, message from fortune");
  const app = express();
  app.get("/text", (req, res) => res.type("text/plain").send("Hello, World!"));
  app.get("/json", (req, res) => res.json({ message: "Hello, World!" }));
  app.get("/fortunes", (req, res) => res.send(fortunesPage(fortunes)));
  app.get("/db", (req, res) => res.send(fortunesPage(fromDb.all())));
  app.get("/compute", (req, res) => res.json({ total: work(10000) }));
  app.listen(port, "127.0.0.1");
