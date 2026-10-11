import { prisma } from '@/lib/prisma';

// Server-side data access for the homepage and topic layout.
// Queries mirror the public API routes exactly (same orderBy/select).
// Fail-soft: any DB error yields safe defaults so builds and ISR
// revalidations never hard-fail — the next revalidation retries.

async function safe(promise, fallback) {
  try {
    return await promise;
  } catch (err) {
    console.error('[home-data]', err);
    return fallback;
  }
}

// Single-key read for root-layout metadata (runs on every page render).
export async function getSiteTitle() {
  const row = await safe(
    prisma.siteDetail.findUnique({ where: { key: 'site_title' }, select: { value: true } }),
    null
  );
  return row?.value || 'ZYD — Quality Assurance & Web Development';
}

export async function getSharedData() {
  const [detailRows, user] = await Promise.all([
    safe(prisma.siteDetail.findMany({ select: { key: true, value: true } }), []),
    safe(
      prisma.user.findFirst({
        where: { role: 'ADMIN' },
        // Deterministic pick: the original admin account (the one edited via
        // /admin/profile). Without orderBy, findFirst returned whichever
        // duplicate admin the planner liked, so saves never reached the landing page.
        orderBy: { createdAt: 'asc' },
        select: {
          name: true,
          email: true,
          bio: true,
          avatar: true,
          location: true,
          website: true,
          linkedin: true,
          github: true,
        },
      }),
      null
    ),
  ]);

  const details = {};
  detailRows.forEach((item) => {
    details[item.key] = item.value;
  });

  return { details, profile: user || {} };
}

// Same select as the public /api/projects handler (card-shaped fields only).
const cardSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  imageUrl: true,
  demoUrl: true,
  githubUrl: true,
  category: true,
  featured: true,
};

const byOrder = [{ order: 'asc' }, { createdAt: 'desc' }];

export async function getAllProjects() {
  return safe(prisma.project.findMany({ orderBy: byOrder, select: cardSelect }), []);
}

export async function getProjectsByCategory(category) {
  return safe(
    prisma.project.findMany({ where: { category }, orderBy: byOrder, select: cardSelect }),
    []
  );
}

// Full row incl. `content` — for the project detail page.
export async function getProjectDetail(slug) {
  return safe(prisma.project.findUnique({ where: { slug } }), null);
}

export async function getTopicPage(slug) {
  return safe(prisma.topicPage.findUnique({ where: { slug } }), null);
}

export async function getHomeData() {
  const [shared, experiences, skills, projects] = await Promise.all([
    getSharedData(),
    safe(
      prisma.experience.findMany({
        orderBy: byOrder,
        select: { id: true, title: true, company: true, location: true, startDate: true, endDate: true, isCurrent: true, description: true, tags: true },
      }),
      []
    ),
    safe(
      prisma.skill.findMany({ orderBy: { order: 'asc' }, select: { id: true, name: true, category: true, iconKey: true, color: true } }),
      []
    ),
    getAllProjects(),
  ]);

  return { ...shared, experiences, skills, projects };
}
