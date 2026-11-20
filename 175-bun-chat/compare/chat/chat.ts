// The page: one WebSocket, each line it hears added to the list.
const socket = new WebSocket(`ws://${location.host}/chat`);
const lines = document.getElementById("lines")!;
const form = document.getElementById("form") as HTMLFormElement;
const name = document.getElementById("name") as HTMLInputElement;
const text = document.getElementById("text") as HTMLInputElement;

socket.addEventListener("message", (event) => {
  const li = document.createElement("li");
  li.textContent = event.data;
  lines.append(li);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.send(JSON.stringify({ name: name.value, text: text.value }));
  text.value = "";
});
