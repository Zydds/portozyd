import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { apiErrorResponse } from '@/lib/api-error';

export async function PUT(request, { params }) {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Next 16: params is a Promise — accessing .slug synchronously yielded
    // undefined, so every topic save failed with a Prisma 500.
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Missing topic slug' }, { status: 400 });
    }

    const body = await request.json();
    const { title, icon, intro, focusItems, toolsItems, highlights } = body;
    const toList = (value) => (Array.isArray(value) ? value : String(value || '').split('\n').filter(Boolean));

    const updated = await prisma.topicPage.upsert({
      where: { slug },
      update: {
        title,
        icon,
        intro,
        focusItems: toList(focusItems),
        toolsItems: toList(toolsItems),
        highlights: toList(highlights),
      },
      create: {
        slug,
        title,
        icon,
        intro,
        focusItems: toList(focusItems),
        toolsItems: toList(toolsItems),
        highlights: toList(highlights),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return apiErrorResponse('Error in PUT topic page:', error);
  }
}
