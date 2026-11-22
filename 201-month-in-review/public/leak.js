document.getElementById('login').onclick = async () => {
  const res = await fetch('/api/login', { method: 'POST' });
  document.getElementById('seen').textContent =
    `document.cookie: "${document.cookie}"\n` +
    `x-middleware-set-cookie: "${res.headers.get('x-middleware-set-cookie')}"`;
};
