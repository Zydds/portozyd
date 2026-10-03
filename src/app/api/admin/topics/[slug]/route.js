import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, icon, intro, focusItems, toolsItems, highlights } = body;

    const updated = await prisma.topicPage.upsert({
      where: { slug: params.slug },
      update: {
        title,
        icon,
        intro,
        focusItems: Array.isArray(focusItems) ? focusItems : focusItems.split('\n').filter(Boolean),
        toolsItems: Array.isArray(toolsItems) ? toolsItems : toolsItems.split('\n').filter(Boolean),
        highlights: Array.isArray(highlights) ? highlights : highlights.split('\n').filter(Boolean),
      },
      create: {
        slug: params.slug,
        title,
        icon,
        intro,
        focusItems: Array.isArray(focusItems) ? focusItems : focusItems.split('\n').filter(Boolean),
        toolsItems: Array.isArray(toolsItems) ? toolsItems : toolsItems.split('\n').filter(Boolean),
        highlights: Array.isArray(highlights) ? highlights : highlights.split('\n').filter(Boolean),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update topic page:', error);
    return NextResponse.json({ error: 'Failed to update topic page' }, { status: 500 });
  }
}
