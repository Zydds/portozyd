import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { apiErrorResponse } from '@/lib/api-error';

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
    return apiErrorResponse('Error in GET /api/admin/details:', err);
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

    // Landing is ISR (300s); refresh it now so copy edits are live immediately.
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Details updated successfully' });
  } catch (err) {
    return apiErrorResponse('Error in PUT /api/admin/details:', err);
  }
}
