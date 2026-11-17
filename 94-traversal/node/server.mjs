// Luigi's downloads, in plain Node: a file from the files folder, by name.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/download') return res.writeHead(404).end();
  const name = url.searchParams.get('name') ?? '';
  try {
    res.end(await fs.readFile(path.join('files', name)));
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Luigi's on http://localhost:8081"));
