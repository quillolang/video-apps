// Who has an account? Logs in to each address with a wrong password, in 20
// rounds, and prints each address's middle time.   node probe.mjs 8081
const port = process.argv[2] ?? '8081';
const names = ['ada', 'bob', 'sam', 'joe', 'kim', 'zoe'];
const times = Object.fromEntries(names.map((name) => [name, []]));
for (let round = 0; round < 20; round++) {
  for (const name of names) {
    const email = `${name}@example.com`;
    const start = performance.now();
    const res = await fetch(`http://localhost:${port}/login`,
      { method: 'POST', body: new URLSearchParams({ email, password: 'guess' }) });
    await res.text();
    times[name].push(performance.now() - start);
  }
}
for (const name of names) {
  const ms = Math.round(times[name].sort((a, b) => a - b)[10]);
  console.log(`${name}@example.com`.padEnd(16), `${ms} ms`.padStart(6));
}
