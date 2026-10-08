import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public read-only endpoint: safe to cache (matches homepage ISR window).
const PUBLIC_CACHE = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET() {
  try {
    const details = await prisma.siteDetail.findMany();
    const detailsMap = {};
    details.forEach(item => {
      detailsMap[item.key] = item.value;
    });
    return NextResponse.json({ details: detailsMap }, { headers: { 'Cache-Control': PUBLIC_CACHE } });
  } catch (err) {
    console.error('Error in GET /api/details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
