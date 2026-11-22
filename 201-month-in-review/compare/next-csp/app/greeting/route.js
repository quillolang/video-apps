import { cookies } from 'next/headers';

export async function GET() {
  const user = (await cookies()).get('session')?.value.split('-')[0] ?? 'guest';
  return new Response(`<h1>Welcome back, ${user}!</h1>`, {
    headers: { 'content-type': 'text/html', 'cache-control': 'public, max-age=60' },
  });
}
