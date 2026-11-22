import { NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

export default async function handler() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', 'ana-7f3c9e21', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}
