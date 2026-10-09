import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

// Stores the asset already compressed: q_auto:good (near-invisible quality loss)
// and never upscaled beyond 1600px wide.
export async function uploadImage(dataUri, { video = false } = {}) {
  ensureConfigured();
  return cloudinary.uploader.upload(dataUri, {
    overwrite: false,
    resource_type: video ? 'video' : 'image',
    // Image-only transform; videos go through Cloudinary's video pipeline as-is.
    ...(video ? {} : { transformation: [{ quality: 'auto:good', width: 1600, crop: 'limit' }] }),
  });
}

export async function destroyImage(publicId, resourceType = 'image') {
  ensureConfigured();
  const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  // "not found" already counts as gone (asset never existed or was removed before)
  return res?.result === 'ok' || res?.result === 'not found';
}
