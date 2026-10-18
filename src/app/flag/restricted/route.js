import { NextResponse } from 'next/server';
import { loadRestrictedDoc, renderRestrictedHtml } from '@/lib/restricted-content';

// DB-backed honeypot page (admin edits via /admin/restricted). Served at the
// historic URL /flag/restricted.html through a rewrite in next.config.mjs.
export const dynamic = 'force-dynamic';

export async function GET() {
  const doc = await loadRestrictedDoc();
  return new NextResponse(renderRestrictedHtml(doc), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
