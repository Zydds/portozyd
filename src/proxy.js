import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Same-origin check for state-changing admin API requests (CSRF belt-and-braces
// on top of NextAuth's CSRF token + SameSite cookies). Browsers always send an
// Origin header on cross-origin and same-origin POST/PUT/PATCH/DELETE fetches.
function isSameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/api/admin/') && MUTATION_METHODS.includes(req.method) && !isSameOrigin(req)) {
    // 404 (not 403) so unprobed endpoints don't confirm their existence.
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const isLoggedIn = !!req.auth;
  const isTargetingAdmin = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';

  if (isTargetingAdmin && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
