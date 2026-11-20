// Trail Club's chat: every socket on the topic hears every line.
import page from "./index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": page,
    "/chat": (req, server) => {
      if (server.upgrade(req)) return;
      return new Response("Upgrade failed", { status: 400 });
    },
  },
  websocket: {
    open(ws) {
      ws.subscribe("chat");
    },
    message(ws, message) {
      const msg = JSON.parse(String(message));
      server.publish("chat", `${msg.name}: ${msg.text}`);
    },
  },
});

console.log(`Listening on ${server.url}`);
