import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const GATE_COOKIE = 'admin_gate';

// ---------------------------------------------------------------------------
// Nonce CSP. A fresh nonce is minted per request and passed to the renderer
// through the request headers, so Next.js stamps it onto its framework and
// inline scripts automatically (see
// node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// Nonces require dynamic rendering, so every HTML route opts into
// request-time rendering via connection() in the root layout.
//
// script-src keeps 'self' but drops 'strict-dynamic': same-origin
// parser-inserted scripts (the static honeypot page, Vercel's injected
// scripts) must stay allowed via 'self', and there are no JSONP or
// user-controlled script sinks on this origin for that allowlist to
// endanger. style-src keeps 'unsafe-inline' because React renders style
// attributes (topic section grids, admin previews) that nonces cannot cover;
// the scanner finding was scoped to script-src.
// ---------------------------------------------------------------------------
function buildCsp(nonce) {
  const isDev = process.env.NODE_ENV !== 'production';
  return [
    "default-src 'self'",
    // Dev-only extras: 'unsafe-eval' = React debugging (see Next CSP docs);
    // va.vercel-scripts.com = Speed Insights debug script (prod uses the
    // same-origin /_vercel/speed-insights/script.js and needs neither).
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    // blob: is the local object-URL used by the media page's upload preview pane.
    "img-src 'self' https: data: blob:",
    // blob: = admin upload-preview object URL; res.cloudinary.com = uploaded videos.
    "media-src 'self' blob: https://res.cloudinary.com",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

// Page/API response: hand the nonce + CSP to the renderer via the request
// headers (Next.js extracts 'nonce-...' from the CSP during rendering) and
// mirror the policy on the response itself.
function cspNext(req, nonce, csp) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

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

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  const isAdminPage = path === '/admin' || path.startsWith('/admin/');
  const isAdminApi = path === '/api/admin' || path.startsWith('/api/admin/');

  if (isAdminPage || isAdminApi) {
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
    const isLoginPage = path === '/admin/login';

    if (isAdminPage && !isLoginPage && !isLoggedIn) {
      return withGateCookie(NextResponse.redirect(new URL('/admin/login', req.nextUrl)), gate.tokenCookie);
    }

    if (isLoginPage && isLoggedIn) {
      return withGateCookie(NextResponse.redirect(new URL('/admin', req.nextUrl)), gate.tokenCookie);
    }

    return withGateCookie(cspNext(req, nonce, csp), gate.tokenCookie);
  }

  return cspNext(req, nonce, csp);
});

export const config = {
  // Everything except big static assets. Deliberately NO `missing: prefetch`
  // conditions: a client-supplied Purpose/next-router-prefetch header must
  // never be able to skip the proxy and its admin gate.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|videos/).*)'],
};
