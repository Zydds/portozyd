import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public read-only endpoint: cached 60s at the route level (JSON responses
// keep the explicit Cache-Control below for CDN/browser caches).
export const revalidate = 60;
const PUBLIC_CACHE = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ projects }, { headers: { 'Cache-Control': PUBLIC_CACHE } });
  } catch (err) {
    console.error('Error in GET /api/projects:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
