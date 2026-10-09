import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';
import { apiErrorResponse } from '@/lib/api-error';
import { uploadImage, destroyImage } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — compression happens on Cloudinary after this
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];

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

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');

      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'File is required' }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Use JPEG, PNG, WebP, or MP4.' },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File exceeds the 5MB limit' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
      const uploaded = await uploadImage(dataUri, { video: file.type.startsWith('video/') });

      const newMedia = await prisma.media.create({
        data: {
          filename: file.name || 'upload',
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          mimeType: file.type,
          size: uploaded.bytes ?? file.size,
          source: 'upload',
          width: uploaded.width ?? null,
          height: uploaded.height ?? null,
        },
      });

      return NextResponse.json({ media: newMedia });
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
        source: 'link',
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
