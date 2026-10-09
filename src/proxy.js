import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const GATE_COOKIE = 'admin_gate';

// ---------------------------------------------------------------------------
// Admin IP gate (fail-closed): only ADMIN_ALLOWED_IPS (exact match) or a valid
// ?k=ADMIN_DEVICE_TOKEN grant access. Unknown client IP = denied. Every denial
// (bot, human, or fail-closed) is lured to the one honeypot page with a 302;
// attack classification for the threat board is derived at read time.
// ---------------------------------------------------------------------------

function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return (req.headers.get('x-real-ip') || '').trim();
}

function isLoopback(ip) {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

// Single honeypot destination for every denial. Built defensively: if URL
// construction throws (fail-closed path), fall back to a manual 302.
function honeypotRedirect(req) {
  try {
    return NextResponse.redirect(new URL('/flag/restricted.html', req.nextUrl), 302);
  } catch {
    return new NextResponse(null, { status: 302, headers: { Location: '/flag/restricted.html' } });
  }
}

// Constant-time-ish string compare (no early exit on first difference).
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length || a.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Fire-and-forget: threat board recording for denied probes. Never blocks or
// fails the response; UA and path are truncated before storage. Path includes
// the query string so payload probes classify too (only denied requests are
// logged, so a correct ?k= token never lands here).
function recordProbe(req, action, status, event) {
  try {
    const ua = (req.headers.get('user-agent') || '').slice(0, 300) || null;
    const target = (req.nextUrl.pathname + req.nextUrl.search).slice(0, 500);
    const p = prisma.probeLog
      .create({
        data: {
          ip: getClientIp(req) || 'unknown',
          path: target,
          method: req.method,
          status,
          action,
          userAgent: ua,
        },
      })
      .catch(() => {});
    if (event && typeof event.waitUntil === 'function') event.waitUntil(p);
  } catch {
    // Logging must never break the response.
  }
}

// Returns { deny } (send it) or { pass, tokenCookie } where tokenCookie is the
// secret to persist when access was granted via ?k=.
function enforceIpGate(req) {
  try {
    const token = process.env.ADMIN_DEVICE_TOKEN || '';
    const isProd = process.env.NODE_ENV === 'production';
    const ip = getClientIp(req);
    const allowlist = (process.env.ADMIN_ALLOWED_IPS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let pass = allowlist.includes(ip); // fail-closed: empty list passes nobody
    let tokenCookie = false;

    // Dev convenience: direct local requests (no proxy headers) keep working.
    if (!pass && !isProd && (ip === '' || isLoopback(ip))) pass = true;

    if (!pass && token) {
      const k = req.nextUrl.searchParams.get('k');
      if (k && safeEqual(k, token)) {
        pass = true;
        tokenCookie = true;
      } else if (safeEqual(req.cookies.get(GATE_COOKIE)?.value || '', token)) {
        pass = true;
      }
    }

    if (pass) return { pass: true, tokenCookie };

    // Every denial goes to the one honeypot page; attack type (bot/scanner/
    // exploit/...) is classified from the logged evidence at read time.
    return { deny: honeypotRedirect(req), action: 'redirect', status: 302 };
  } catch {
    // Fail-closed: any error in the gate denies the request (also to the honeypot).
    return { deny: honeypotRedirect(req), action: 'redirect', status: 302 };
  }
}

// Persist the gate cookie ONLY when access was granted via ?k=; IP-allowlisted
// requests must not silently receive the bearer token.
function withGateCookie(res, tokenCookie) {
  if (!tokenCookie) return res;
  const token = process.env.ADMIN_DEVICE_TOKEN || '';
  if (!token) return res;
  res.cookies.set(GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

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

export default auth((req, event) => {
  const path = req.nextUrl.pathname;

  const gate = enforceIpGate(req);
  if (gate.deny) {
    recordProbe(req, gate.action, gate.status, event);
    return gate.deny;
  }

  if (path.startsWith('/api/admin/') && MUTATION_METHODS.includes(req.method) && !isSameOrigin(req)) {
    // Cross-origin mutation attempt: lured to the honeypot (logged as origin).
    recordProbe(req, 'origin', 302, event);
    return honeypotRedirect(req);
  }

  const isLoggedIn = !!req.auth;
  const isTargetingAdmin = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';

  if (isTargetingAdmin && !isLoginPage && !isLoggedIn) {
    return withGateCookie(NextResponse.redirect(new URL('/admin/login', req.nextUrl)), gate.tokenCookie);
  }

  if (isLoginPage && isLoggedIn) {
    return withGateCookie(NextResponse.redirect(new URL('/admin', req.nextUrl)), gate.tokenCookie);
  }

  return withGateCookie(NextResponse.next(), gate.tokenCookie);
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
