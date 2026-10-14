'use client';

// Client island for topic section media: <img> needs an onError fallback, and
// event handlers can't be passed in a Server Component (TopicPageLayout).

// First-frame JPG from a res.cloudinary.com video URL (so_0 = second offset 0).
// Only delivery URLs are rewritten; any other video host gets no poster.
function cloudinaryVideoPoster(url) {
  try {
    const u = new URL(url);
    if (u.hostname !== 'res.cloudinary.com') return null;
    const marker = '/video/upload/';
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const head = u.pathname.slice(0, idx + marker.length);
    let tail = u.pathname.slice(idx + marker.length);
    const dot = tail.lastIndexOf('.');
    if (dot === -1) return null;
    tail = `${tail.slice(0, dot)}.jpg`;
    u.pathname = `${head}so_0,f_jpg,q_auto,w_1200/${tail}`;
    return u.toString();
  } catch {
    return null;
  }
}

export default function TopicSectionMedia({ src, alt, isVideo = false }) {
  if (isVideo) {
    return (
      <video
        src={src}
        poster={cloudinaryVideoPoster(src) || undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
