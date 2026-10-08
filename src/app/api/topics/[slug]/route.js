import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public read-only endpoint: cached 60s at the route level (JSON responses
// keep the explicit Cache-Control below for CDN/browser caches).
export const revalidate = 60;
const PUBLIC_CACHE = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const topic = await prisma.topicPage.findUnique({
      where: { slug: resolvedParams.slug },
    });

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json(topic, { headers: { 'Cache-Control': PUBLIC_CACHE } });
  } catch (error) {
    console.error('Error in GET /api/topics/[slug]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
