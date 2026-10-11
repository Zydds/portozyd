// One-time/idempotent converter: fills TopicPage.sections from the legacy
// focusItems/toolsItems/highlights arrays, but ONLY when sections is still
// null/empty — it never overwrites sections you've edited in the admin.
//
// Usage: node scripts/seed-topic-sections.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const GROUPS = [
  { heading: '🎯 Key Focus & Philosophy', key: 'focusItems' },
  { heading: '🛠️ Tools & Technologies', key: 'toolsItems' },
  { heading: '📌 Highlighted Projects & Insights', key: 'highlights' },
];

async function main() {
  const pages = await prisma.topicPage.findMany();
  for (const page of pages) {
    const hasSections = Array.isArray(page.sections) && page.sections.length > 0;
    if (hasSections) {
      console.log(`skip ${page.slug}: already has ${page.sections.length} section(s)`);
      continue;
    }

    const sections = GROUPS.filter((g) => Array.isArray(page[g.key]) && page[g.key].length > 0).map(
      (g) => ({ heading: g.heading, body: page[g.key].join('\n'), mediaUrl: '' })
    );

    if (sections.length === 0) {
      console.log(`skip ${page.slug}: no legacy content to convert`);
      continue;
    }

    await prisma.topicPage.update({ where: { id: page.id }, data: { sections } });
    console.log(`filled ${page.slug}: ${sections.length} section(s)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
