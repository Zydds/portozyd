import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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
    console.error('Error in GET /api/admin/media:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    if (!url || !filename) {
      return NextResponse.json({ error: 'Filename and URL are required' }, { status: 400 });
    }

    const newMedia = await prisma.media.create({
      data: {
        filename,
        url,
        publicId: publicId || `manual_${Date.now()}`,
        mimeType: mimeType || 'image/jpeg',
        size: size ? parseInt(size, 10) : null,
      },
    });

    return NextResponse.json({ media: newMedia });
  } catch (err) {
    console.error('Error in POST /api/admin/media:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
    console.error('Error in DELETE /api/admin/media:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
