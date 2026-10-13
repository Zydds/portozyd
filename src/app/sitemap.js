import { prisma } from '@/lib/prisma';
import { VALID_CATEGORIES } from '@/lib/portfolio-meta';

const SITE = 'https://www.zaidanghiffari.my.id';

// Hourly: project pages are DB-driven and admin edits should show up in the
// sitemap without waiting for a redeploy. Queries below are best-effort — if
// the DB is unreachable the static core is still served and the next
// revalidation retries.
export const revalidate = 3600;

export default async function sitemap() {
  const routes = [
    { url: SITE, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    ...VALID_CATEGORIES.map((category) => ({
      url: `${SITE}/portfolio/${category}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    { url: `${SITE}/gaming`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/others`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const projects = await prisma.project.findMany({ select: { category: true, slug: true } });
    for (const p of projects) {
      routes.push({
        url: `${SITE}/portfolio/${p.category}/${p.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // Static core only; retried on the next hourly revalidation.
  }

  return routes;
}
