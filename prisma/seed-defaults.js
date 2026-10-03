const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default skills and experiences...');

  const email = 'zaidan.azhar@example.com';
  const password = 'admin_secure_password_2026';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashedPassword, name: 'Zaidan Ghiffari Azhar', role: 'ADMIN' },
  });

  const defaultSkills = [
    { id: 'skill-js', name: 'JavaScript', category: 'Languages', color: '#F7DF1E' },
    { id: 'skill-ts', name: 'TypeScript', category: 'Languages', color: '#3178C6' },
    { id: 'skill-py', name: 'Python', category: 'Languages', color: '#3776AB' },
    { id: 'skill-php', name: 'PHP', category: 'Languages', color: '#777BB4' },
    { id: 'skill-react', name: 'React', category: 'Frameworks & Libraries', color: '#61DAFB' },
    { id: 'skill-next', name: 'Next.js', category: 'Frameworks & Libraries', color: '#F5F5F5' },
    { id: 'skill-vue', name: 'Vue.js', category: 'Frameworks & Libraries', color: '#4FC08D' },
    { id: 'skill-node', name: 'Node.js', category: 'Frameworks & Libraries', color: '#339933' },
    { id: 'skill-tailwind', name: 'Tailwind CSS', category: 'Frameworks & Libraries', color: '#06B6D4' },
    { id: 'skill-wp', name: 'WordPress', category: 'Frameworks & Libraries', color: '#21759B' },
    { id: 'skill-laravel', name: 'Laravel', category: 'Frameworks & Libraries', color: '#FF2D20' },
    { id: 'skill-cypress', name: 'Cypress', category: 'Testing & QA Tools', color: '#17202C' },
    { id: 'skill-playwright', name: 'Playwright', category: 'Testing & QA Tools', color: '#45ba4b' },
    { id: 'skill-jest', name: 'Jest', category: 'Testing & QA Tools', color: '#C21325' },
    { id: 'skill-postman', name: 'Postman', category: 'Testing & QA Tools', color: '#FF6C37' },
    { id: 'skill-notion', name: 'Notion', category: 'Tools & Productivity', color: '#F5F5F5' },
    { id: 'skill-git', name: 'Git', category: 'Tools & Productivity', color: '#F05032' },
    { id: 'skill-github', name: 'GitHub', category: 'Tools & Productivity', color: '#F5F5F5' },
  ];

  for (const skill of defaultSkills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: skill,
      create: skill,
    });
  }

  const defaultExperiences = [
    { id: 'exp-intern', title: 'Software Developer Intern', company: '[Company Name]', location: 'Remote', startDate: '2024-09-01', endDate: '2024-12-31', isCurrent: false, description: 'Describe your internship responsibilities, what you built, and the impact you made.', tags: ['React', 'Next.js', 'Tailwind CSS'] },
    { id: 'exp-freelance', title: 'Freelance Landing Page Designer', company: 'Self-Employed', location: 'Remote', startDate: '2025-01-01', endDate: null, isCurrent: true, description: 'Describe your freelance work — clients, projects delivered, tools used, and outcomes.', tags: ['WordPress', 'Laravel', 'PHP'] },
  ];

  for (const exp of defaultExperiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp,
    });
  }

  console.log('Done. Default skills and experiences seeded.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => await prisma.$disconnect());
