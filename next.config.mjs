/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  poweredByHeader: false,
  // Fonts always fetch CORS-mode; preload links without crossorigin never
  // match them (double download + "preloaded but not used" console warnings).
  crossOrigin: 'anonymous',
  images: {
    // Only hosts our content actually uses; arbitrary admin URLs fail
    // over gracefully via each component's onError fallback.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    // SimpleIcons serves SVGs through the optimizer.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Canonical domain: any request that still arrives on the old Vercel
      // subdomain (e.g. bookmarks, old scanners hitting the honeypot) is
      // permanently moved to the custom domain. Host-matched, so localhost
      // and preview deployments are unaffected.
      {
        source: '/',
        has: [{ type: 'host', value: 'portozyd.vercel.app' }],
        destination: 'https://zaidanghiffari.my.id/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'portozyd.vercel.app' }],
        destination: 'https://zaidanghiffari.my.id/:path*',
        permanent: true,
      },
      // Old standalone topic pages folded into /portfolio/[category].
      { source: '/qa', destination: '/portfolio/qa', permanent: true },
      { source: '/webdev', destination: '/portfolio/web', permanent: true },
      { source: '/pm', destination: '/portfolio/pm', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Apply these security headers globally to every route.
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Content-Security-Policy is set per-request in src/proxy.js (nonce).
        ],
      },
      {
        // Big immutable media: never revalidate. Rename the file when replacing it.
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
