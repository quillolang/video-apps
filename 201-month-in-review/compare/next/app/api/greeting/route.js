async function greetingFor(userIdBytes) {
  'use cache';
  const bytes = userIdBytes instanceof Blob ? new Uint8Array(await userIdBytes.arrayBuffer()) : userIdBytes;
  const id = new TextDecoder().decode(bytes);
  return { id, madeAt: new Date().toISOString() };
}

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  const user = q.get('user') ?? 'ana', kind = q.get('kind') ?? 'u8';
  const enc = new TextEncoder().encode(user);
  let arg = enc;
  if (kind === 'view') { const all = new TextEncoder().encode('token:' + user); arg = all.subarray(6); }
  if (kind === 'blob') arg = new Blob([enc]);
  if (kind === 'long') arg = new TextEncoder().encode(user.padEnd(4000, '.'));
  if (kind === 'buf') arg = enc.buffer;
  const data = await greetingFor(arg);
  return Response.json({ asked: user, kind, ...data, id: data.id.slice(0, 20) });
}
