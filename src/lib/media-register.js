import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

function filenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const last = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() || '');
    return last && last.includes('.') ? last : parsed.hostname;
  } catch {
    return 'image';
  }
}

// Keeps the Media library complete: any external image URL saved on a project
// or profile is registered automatically (idempotent by exact url).
export async function registerExternalMedia(url) {
  if (!url) return;
  try {
    const existing = await prisma.media.findFirst({ where: { url } });
    if (existing) return;
    await prisma.media.create({
      data: {
        filename: filenameFromUrl(url),
        url,
        publicId: 'ext_' + crypto.createHash('sha1').update(url).digest('hex').slice(0, 16),
        source: 'link',
      },
    });
  } catch (err) {
    if (err?.code === 'P2002') return; // concurrent save registered the same url first
    // Bookkeeping must never fail the parent save — surface it in logs instead.
    console.error('registerExternalMedia failed:', err);
  }
}
