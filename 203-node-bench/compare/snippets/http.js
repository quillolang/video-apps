  const fromDb = new DatabaseSync(process.env.DB || "fortunes.db").prepare("select id, message from fortune");
  const send = (res, type, body) => {
    res.writeHead(200, { "Content-Type": type, "Content-Length": Buffer.byteLength(body) });
    res.end(body);
  };
  http.createServer((req, res) => {
    switch (req.url) {
      case "/text": return send(res, "text/plain; charset=utf-8", "Hello, World!");
      case "/json": return send(res, "application/json", JSON.stringify({ message: "Hello, World!" }));
      case "/fortunes": return send(res, "text/html; charset=utf-8", fortunesPage(fortunes));
      case "/db": return send(res, "text/html; charset=utf-8", fortunesPage(fromDb.all()));
      case "/compute": return send(res, "application/json", JSON.stringify({ total: work(10000) }));
      default: res.writeHead(404); res.end();
    }
  }).listen(port, "127.0.0.1");
