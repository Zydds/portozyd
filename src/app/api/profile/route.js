import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public read-only endpoint: safe to cache (matches homepage ISR window).
const PUBLIC_CACHE = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        name: true,
        email: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
      },
    });

    return NextResponse.json({ profile: user || {} }, { headers: { 'Cache-Control': PUBLIC_CACHE } });
  } catch (err) {
    console.error('Error in GET /api/profile:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
