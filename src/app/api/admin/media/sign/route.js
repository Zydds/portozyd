import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { apiErrorResponse } from '@/lib/api-error';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const MAX_FILE_SIZE = 50 * 1024 * 1024;
// Same near-invisible quality the old server-side pipeline applied; videos pass through as-is.
const IMAGE_TRANSFORMATION = 'q_auto:good/w_1600/c_limit';

// Signs a one-shot direct browser -> Cloudinary upload. Files never pass through
// the Vercel function (4.5MB body cap), so videos up to the 50MB UI limit work.
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, mimeType, size } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPEG, PNG, WebP, or MP4.' },
        { status: 400 }
      );
    }
    if (size != null && (!Number.isFinite(Number(size)) || Number(size) > MAX_FILE_SIZE)) {
      return NextResponse.json({ error: 'File exceeds the 50MB limit' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Upload storage is not configured' }, { status: 500 });
    }

    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
    const publicId = crypto.randomUUID().replaceAll('-', '');
    const timestamp = Math.round(Date.now() / 1000);

    // Cloudinary signs only the params sent alongside the file (sorted, joined,
    // secret appended). The api secret never leaves the server.
    const params = resourceType === 'video'
      ? { public_id: publicId, timestamp }
      : { public_id: publicId, timestamp, transformation: IMAGE_TRANSFORMATION };
    const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&');
    const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      publicId,
      resourceType,
      transformation: resourceType === 'video' ? null : IMAGE_TRANSFORMATION,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    });
  } catch (err) {
    return apiErrorResponse('Error in POST /api/admin/media/sign:', err);
  }
}
