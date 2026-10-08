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

export async function getSharedData() {
  const [detailRows, user] = await Promise.all([
    safe(prisma.siteDetail.findMany(), []),
    safe(
      prisma.user.findFirst({
        where: { role: 'ADMIN' },
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

export async function getHomeData() {
  const [shared, experiences, skills, projects] = await Promise.all([
    getSharedData(),
    safe(prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }), []),
    safe(prisma.skill.findMany({ orderBy: { order: 'asc' } }), []),
    safe(prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }), []),
  ]);

  return { ...shared, experiences, skills, projects };
}
