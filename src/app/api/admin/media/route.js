import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';
import { apiErrorResponse } from '@/lib/api-error';
import { destroyImage } from '@/lib/cloudinary';

// File uploads go browser -> Cloudinary directly (signed by /api/admin/media/sign);
// this route only stores the resulting metadata row, so no body-size issues here.
const MAX_DIRECT_SIZE = 50 * 1024 * 1024;

function toIntOrNull(value) {
  if (value == null) return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [mediaList, projects, users, detailRows] = await Promise.all([
      prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.project.findMany({ select: { id: true, title: true, imageUrl: true } }),
      prisma.user.findMany({ select: { id: true, email: true, avatar: true } }),
      prisma.siteDetail.findMany({ select: { key: true, value: true } }),
    ]);

    // Site-detail fields that reference media URLs (deleting them breaks the landing page).
    const detailLabels = {
      hero_video_url: 'Hero Video',
      hero_poster_url: 'Hero Poster',
      edu_1_image: 'Education 1 Photo',
      edu_2_image: 'Education 2 Photo',
    };

    const media = mediaList.map((item) => ({
      ...item,
      usedBy: [
        ...projects
          .filter((p) => p.imageUrl && p.imageUrl === item.url)
          .map((p) => ({ type: 'project', id: p.id, title: p.title })),
        ...users
          .filter((u) => u.avatar && u.avatar === item.url)
          .map((u) => ({ type: 'avatar', id: u.id, title: u.email })),
        ...detailRows
          .filter((d) => detailLabels[d.key] && d.value && d.value === item.url)
          .map((d) => ({ type: 'detail', id: d.key, title: detailLabels[d.key] })),
      ],
    }));

    return NextResponse.json({ media });
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
    const { filename, url, publicId, mimeType, size, width, height, source } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const safeMediaUrl = safeUrl(url);
    if (!safeMediaUrl) {
      // Media.url is a non-nullable column, so an unsafe URL is rejected outright
      // instead of stored as null.
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const isDirectUpload = source === 'upload';
    if (isDirectUpload && !publicId) {
      return NextResponse.json({ error: 'publicId is required for uploads' }, { status: 400 });
    }
    const sizeBytes = toIntOrNull(size);
    if (sizeBytes != null && (sizeBytes < 0 || sizeBytes > MAX_DIRECT_SIZE)) {
      return NextResponse.json({ error: 'File exceeds the 50MB limit' }, { status: 400 });
    }

    const newMedia = await prisma.media.create({
      data: {
        filename,
        url: safeMediaUrl,
        publicId: publicId || `manual_${Date.now()}`,
        mimeType: mimeType || 'image/jpeg',
        size: sizeBytes,
        source: isDirectUpload ? 'upload' : 'link',
        width: toIntOrNull(width),
        height: toIntOrNull(height),
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

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (media.source === 'upload') {
      const destroyed = await destroyImage(
        media.publicId,
        media.mimeType?.startsWith('video/') ? 'video' : 'image'
      );
      if (!destroyed) {
        return NextResponse.json(
          { error: 'Failed to delete the asset from Cloudinary' },
          { status: 502 }
        );
      }
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiErrorResponse('Error in DELETE /api/admin/media:', err);
  }
}
