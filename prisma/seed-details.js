const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialDetails = [
  {
    key: 'about_p1',
    value: "I'm a software quality advocate and web developer based in Indonesia. My journey in tech began with a curiosity about how things work behind the scenes, which naturally led me to quality assurance and full-stack development.",
  },
  {
    key: 'about_p2',
    value: "I specialize in building reliable, user-friendly web applications while ensuring every detail meets high-quality standards — from automated test suites to responsive interfaces.",
  },
  {
    key: 'about_p3',
    value: "When I'm not testing or coding, you'll find me exploring new technologies, playing strategy games, or organizing projects with my favorite productivity tools.",
  },
  {
    key: 'contact_intro',
    value: "Whether you have a question about QA testing, web development projects, or project management methodologies, feel free to drop a message.",
  },
  {
    key: 'footer_quote',
    value: "Building reliable software and quality-driven web experiences. Always learning, always improving.",
  },
];

async function main() {
  for (const item of initialDetails) {
    await prisma.siteDetail.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log('Site details seeded successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
