import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json({ profile: user || {} });
  } catch (err) {
    console.error('Error in GET /api/profile:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
