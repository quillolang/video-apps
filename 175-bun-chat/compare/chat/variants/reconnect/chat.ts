// The page: its WebSocket opened again a second after it closes,
// and lines sent meanwhile kept until then.
const lines = document.getElementById("lines")!;
const form = document.getElementById("form") as HTMLFormElement;
const name = document.getElementById("name") as HTMLInputElement;
const text = document.getElementById("text") as HTMLInputElement;
const waiting: string[] = [];
let socket: WebSocket;

function connect() {
  socket = new WebSocket(`ws://${location.host}/chat`);
  socket.addEventListener("open", () => {
    while (waiting.length) socket.send(waiting.shift()!);
  });
  socket.addEventListener("message", (event) => {
    const li = document.createElement("li");
    li.textContent = event.data;
    lines.append(li);
  });
  socket.addEventListener("close", () => setTimeout(connect, 1000));
}
connect();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const msg = JSON.stringify({ name: name.value, text: text.value });
  if (socket.readyState === WebSocket.OPEN) socket.send(msg);
  else waiting.push(msg);
  text.value = "";
});
