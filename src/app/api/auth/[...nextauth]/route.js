import { NextResponse } from 'next/server';
import { handlers } from '@/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export function GET(request) {
  return handlers.GET(request);
}

// Credentials sign-in attempts are rate-limited per IP (same in-memory
// limiter as /api/contact) to block password brute force. Other NextAuth
// POSTs (csrf, callback/logout, etc.) pass through untouched.
export function POST(request) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/auth/callback/credentials') {
    const limit = checkRateLimit(`login:${getClientIp(request)}`, { limit: 10, windowMs: 15 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }
  }
  return handlers.POST(request);
}
