// Node has no escaping built in: this is the usual five-character escape.
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function fortunesPage(list) {
  const all = [...list, { id: 0, message: "Additional fortune added at request time." }];
  all.sort((a, b) => (a.message < b.message ? -1 : a.message > b.message ? 1 : 0));
  let rows = "";
  for (const f of all) rows += `<tr><td>${f.id}</td><td>${esc(f.message)}</td></tr>`;
  return `<!doctype html><html><head><title>Fortunes</title></head><body><table>` +
    `<tr><th>id</th><th>message</th></tr>${rows}</table></body></html>`;
}
