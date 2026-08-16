import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get('descubra_artes_role')?.value;
  const userCookie = request.cookies.get('descubra_artes_user')?.value;

  // 1. Strict Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const isAdmin = roleCookie === 'ADMIN' || (userCookie && userCookie.includes('"role":"ADMIN"'));
    if (!isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'unauthorized_admin');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Strict Artisan Panel Protection
  if (pathname.startsWith('/painel')) {
    const isAuth = Boolean(roleCookie || userCookie);
    if (!isAuth) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // 3. Security Headers (Defense in Depth)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/painel/:path*'],
};
