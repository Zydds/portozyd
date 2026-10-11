import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
    const { title, icon, intro, focusItems, toolsItems, highlights, sections } = body;
    const toList = (value) => (Array.isArray(value) ? value : String(value || '').split('\n').filter(Boolean));

    // Blog sections: [{ heading, body, mediaUrl, ratio, mediaSide }]. Coerce to
    // plain strings, drop fully-empty rows, cap at 50 so a bad payload can't
    // bloat the row. ratio defaults to 3:1 (75/25); mediaSide to "right".
    const ALLOWED_RATIOS = new Set(['3:1', '2:1', '1:1', '1:2', '1:3']);
    const toSections = (value) =>
      (Array.isArray(value) ? value : [])
        .slice(0, 50)
        .map((s) => ({
          heading: String(s?.heading || '').trim(),
          body: String(s?.body || '').trim(),
          mediaUrl: String(s?.mediaUrl || '').trim(),
          ratio: ALLOWED_RATIOS.has(s?.ratio) ? s.ratio : '3:1',
          mediaSide: s?.mediaSide === 'left' ? 'left' : 'right',
        }))
        .filter((s) => s.heading || s.body || s.mediaUrl);

    const data = {
      title,
      icon,
      intro,
      // Legacy list fields: only touched when the client sends them, so the
      // sections-first editor can't silently wipe existing content.
      ...(focusItems !== undefined ? { focusItems: toList(focusItems) } : {}),
      ...(toolsItems !== undefined ? { toolsItems: toList(toolsItems) } : {}),
      ...(highlights !== undefined ? { highlights: toList(highlights) } : {}),
      ...(sections !== undefined ? { sections: toSections(sections) } : {}),
    };

    const updated = await prisma.topicPage.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });

    // Topic pages are ISR (60–300s); refresh them so edits are live immediately.
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return apiErrorResponse('Error in PUT topic page:', error);
  }
}
