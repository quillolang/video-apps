// Fortune cookies: a page a friend wrote, in Deno. What it may do is what `deno run` is told it may.

const fortunes = [
  "A pleasant surprise is waiting for you.",
  "Your code will compile on the first try.",
  "Today is a good day to write a test.",
  "Someone will thank you for a clear error message.",
];

const css = `
  body { margin: 0; font: 18px/1.5 system-ui, sans-serif; background: #fff4e0; color: #4a3423; }
  main { max-width: 440px; margin: 0 auto; padding: 32px 20px; text-align: center; }
  h1 { font: 700 34px Georgia, serif; color: #b5541c; margin: 0 0 18px; }
  .fortune { background: #fff; border-radius: 14px; padding: 22px; font-size: 21px;
             box-shadow: 0 4px 9px #0002; }
  .lucky { color: #9a7a62; } .lucky b { color: #b5541c; }
`;

const pick = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Counts each visit, on the friend's stats site.
async function track(page: string) {
  try {
    await fetch("https://stats.example.com/hit", {
      method: "POST",
      body: JSON.stringify({ page, app: Deno.env.get("APP_NAME") }),
      signal: AbortSignal.timeout(2000),
    });
  } catch (e) {
    console.log(`track: ${e}`);
  }
}

Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    track("/");
    const name = Deno.env.get("APP_NAME") ?? "Fortune cookies";
    return new Response(`<!doctype html><html>
      <head><title>Fortune cookies</title><style>${css}</style></head>
      <body><main>
        <h1>🥠 ${esc(name)}</h1>
        <p class="fortune">${esc(fortunes[pick(0, fortunes.length - 1)])}</p>
        <p class="lucky">Lucky number: <b>${pick(1, 99)}</b></p>
      </main></body>
    </html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
  }

  // "For debugging": the server's settings.
  if (url.pathname === "/debug") {
    return Response.json({ app: Deno.env.get("APP_NAME"), secret: Deno.env.get("SECRET_KEY") });
  }

  // A link preview: fetches any address it is given.
  if (url.pathname === "/preview") {
    try {
      const r = await fetch(url.searchParams.get("url") ?? "", { signal: AbortSignal.timeout(2000) });
      return new Response(`${r.status}, ${(await r.text()).length} characters`);
    } catch (e) {
      return new Response(`Could not fetch it: ${e}`);
    }
  }

  // Cracks n cookies, one by one, to find the luckiest.
  if (url.pathname === "/crack") {
    const n = Number(url.searchParams.get("n"));
    let best = 0;
    for (let i = 0; i < n; i++) best = Math.max(best, (i * 7919) % 100);
    return new Response(`Cracked ${n} cookies; the luckiest was ${best}`);
  }

  return new Response("Not found", { status: 404 });
});
