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
    { id: 'skill-office', name: 'MS Office', category: 'Soft Skills', color: '#0078D4' },
    { id: 'skill-english', name: 'English speaking', category: 'Soft Skills', color: '#6366F1' },
    { id: 'skill-indo', name: 'Indonesian (native)', category: 'Soft Skills', color: '#E70011' },
    { id: 'skill-canva', name: 'Canva (basic editing)', category: 'Soft Skills', color: '#00C4CC' },
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

  const defaultProjects = [
    {
      id: 'proj-ecommerce',
      title: 'E-Commerce Analytics Platform',
      slug: 'ecommerce-analytics',
      description: 'Real-time sales dashboard with inventory management, automated reports, and webhooks.',
      category: 'web',
      featured: true,
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/ecommerce-analytics',
      order: 1,
    },
    {
      id: 'proj-qa-suite',
      title: 'QA Automated Testing Pipeline',
      slug: 'qa-automated-suite',
      description: 'End-to-end regression and API testing framework using Cypress, Playwright, and GitHub Actions.',
      category: 'qa',
      featured: true,
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/qa-suite',
      order: 2,
    },
    {
      id: 'proj-pm-sprint',
      title: 'Sprint Tracking & Jira Sync',
      slug: 'sprint-tracking-jira',
      description: 'Agile project tracker with automated sprint velocity metrics and Jira bidirectional sync.',
      category: 'pm',
      featured: false,
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/sprint-tracker',
      order: 3,
    },
  ];

  for (const proj of defaultProjects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj,
    });
  }

  console.log('Done. Default skills, experiences, and projects seeded.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => await prisma.$disconnect());
