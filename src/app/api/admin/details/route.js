import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET: Return all site details for public or admin use
export async function GET() {
  try {
    const details = await prisma.siteDetail.findMany();
    const detailsMap = {};
    details.forEach(item => {
      detailsMap[item.key] = item.value;
    });
    return NextResponse.json({ details: detailsMap });
  } catch (err) {
    console.error('Error in GET /api/admin/details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update site details (Protected)
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { details } = body;

    if (!details || typeof details !== 'object') {
      return NextResponse.json({ error: 'Invalid details payload' }, { status: 400 });
    }

    const updates = Object.entries(details).map(([key, value]) =>
      prisma.siteDetail.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: 'Details updated successfully' });
  } catch (err) {
    console.error('Error in PUT /api/admin/details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
