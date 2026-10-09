import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';
import { apiErrorResponse } from '@/lib/api-error';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ media: mediaList });
  } catch (err) {
    return apiErrorResponse('Error in GET /api/admin/media:', err);
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { filename, url, publicId, mimeType, size } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const safeMediaUrl = safeUrl(url);
    if (!safeMediaUrl) {
      // Media.url is a non-nullable column, so an unsafe URL is rejected outright
      // instead of stored as null.
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const newMedia = await prisma.media.create({
      data: {
        filename,
        url: safeMediaUrl,
        publicId: publicId || `manual_${Date.now()}`,
        mimeType: mimeType || 'image/jpeg',
        size: size ? parseInt(size, 10) : null,
      },
    });

    return NextResponse.json({ media: newMedia });
  } catch (err) {
    return apiErrorResponse('Error in POST /api/admin/media:', err);
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiErrorResponse('Error in DELETE /api/admin/media:', err);
  }
}
