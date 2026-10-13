import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

// Uploads are signed direct browser -> Cloudinary transfers (see
// /api/admin/media/sign); the server only ever destroys assets.
export async function destroyImage(publicId, resourceType = 'image') {
  ensureConfigured();
  const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  // "not found" already counts as gone (asset never existed or was removed before)
  return res?.result === 'ok' || res?.result === 'not found';
}
