'use client';
import { useState } from 'react';
import './news.css';

export default function Leak() {
  const [seen, setSeen] = useState('');
  async function logIn() {
    const res = await fetch('/api/login', { method: 'POST' });
    setSeen(`document.cookie: "${document.cookie}"\n` +
      `x-middleware-set-cookie: "${res.headers.get('x-middleware-set-cookie')}"`);
  }
  return (
    <main>
      <h1>Log in</h1>
      <button id="login" onClick={logIn}>Log in</button>
      <pre id="seen">{seen}</pre>
    </main>
  );
}
