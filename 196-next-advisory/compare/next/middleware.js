// Only signed-in members may open /admin: the check runs in middleware, before the page.
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (!request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = { matcher: '/admin/:path*' }
