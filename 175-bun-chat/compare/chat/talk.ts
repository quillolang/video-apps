// A program in the chat, not a page: it says one line,
// and prints what it hears for two seconds.
const socket = new WebSocket("ws://localhost:3000/chat");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ name: "Bot", text: Bun.argv[2] ?? "hi" }));
});
socket.addEventListener("message", (event) => console.log(event.data));
setTimeout(() => socket.close(), 2000);
