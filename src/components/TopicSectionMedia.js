'use client';

// Client island for topic section media: <img> needs an onError fallback, and
// event handlers can't be passed in a Server Component (TopicPageLayout).
export default function TopicSectionMedia({ src, alt, isVideo = false }) {
  if (isVideo) {
    return <video src={src} controls preload="metadata" />;
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
