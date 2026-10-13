const SITE = 'https://www.zaidanghiffari.my.id';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/flag', '/api'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
