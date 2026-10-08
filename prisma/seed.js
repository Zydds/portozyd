const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with full default data...');

  // 1. Create Admin User
  const email = process.env.ADMIN_EMAIL || 'zaidan.azhar@example.com';
  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not set — refusing to seed with a fallback password.');
    process.exit(1);
  }
  const password = process.env.ADMIN_PASSWORD;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Zaidan Ghiffari Azhar',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // 2. Seed 5 Topic Pages
  const topicPages = [
    {
      slug: 'qa',
      title: 'Quality Assurance',
      icon: '🛡️',
      intro: 'Ensuring software reliability, performance, and seamless user experiences through rigorous testing methodologies.',
      focusItems: [
        'Test Plan Design & Documentation',
        'Automated End-to-End Testing',
        'Bug Tracking & Detailed Reports',
        'Usability & Edge Case Testing',
        'Continuous Quality Improvement',
      ],
      toolsItems: [
        'Cypress & Playwright (E2E Testing)',
        'Postman (API Testing)',
        'Jest & React Testing Library',
        'CI/CD Pipeline Integration',
        'Browser DevTools & Debugging',
      ],
      highlights: [
        'Automated E2E Suite for E-Commerce Application',
        'Performance Benchmark Analysis for Web Application',
        'API Contract Testing with Postman Collections',
      ],
    },
    {
      slug: 'webdev',
      title: 'Web Development',
      icon: '💻',
      intro: 'Building modern, scalable, and responsive web applications with a focus on clean code and robust architecture.',
      focusItems: [
        'Component-Based Architecture',
        'Responsive & Accessible UI/UX',
        'State Management & Data Flow',
        'SEO & Performance Optimization',
        'Clean, Maintainable Code',
      ],
      toolsItems: [
        'React, Next.js & Vue',
        'Tailwind CSS & Styled Components',
        'Node.js & Express',
        'RESTful APIs & GraphQL',
        'Git, GitHub & Version Control',
      ],
      highlights: [
        'Full-Stack E-Commerce Platform with Next.js',
        'Interactive Dashboard for Data Visualization',
        'Custom WordPress Theme Development',
      ],
    },
    {
      slug: 'pm',
      title: 'Project Management',
      icon: '📊',
      intro: 'Orchestrating teams, workflows, and resources to deliver high-quality software products on time and within budget.',
      focusItems: [
        'Agile & Scrum Methodologies',
        'Requirements Gathering & Scoping',
        'Risk Management & Mitigation',
        'Cross-Functional Team Collaboration',
        'Stakeholder Communication',
      ],
      toolsItems: [
        'Jira & Confluence',
        'Notion & Trello',
        'Asana & Monday.com',
        'Gantt Charts & Roadmapping',
        'Slack, Teams & Zoom',
      ],
      highlights: [
        'Led a Cross-Functional Team to Deliver a Key Product Feature',
        'Implemented Agile Workflows to Increase Team Velocity by 20%',
        'Managed a $50k Budget Software Migration Project',
      ],
    },
    {
      slug: 'gaming',
      title: 'Gaming',
      icon: '🎮',
      intro: 'Exploring virtual worlds, competitive strategies, and the technology that powers modern interactive entertainment.',
      focusItems: [
        'Strategy & Tactical Gameplay',
        'Community Building & Moderation',
        'Game Mechanics Analysis',
        'Hardware Setup & Optimization',
        'Esports & Competitive Scene',
      ],
      toolsItems: [
        'Discord (Server Management)',
        'OBS Studio (Streaming)',
        'Steam & Battle.net',
        'Custom PC Building',
        'Performance Tuning (Overclocking)',
      ],
      highlights: [
        'Managed a 500+ Member Discord Community',
        'Achieved Top 5% Rank in Competitive Strategy Game',
        'Optimized Custom PC Build for 144Hz+ Gaming',
      ],
    },
    {
      slug: 'others',
      title: 'Other Interests',
      icon: '🌌',
      intro: 'A collection of hobbies, explorations, and continuous learning adventures beyond code and quality assurance.',
      focusItems: [
        'Continuous Learning & Skill Acquisition',
        'Technology & Gadget Exploration',
        'Creative Writing & Blogging',
        'Productivity Systems & Workflows',
        'Open Source Contributions',
      ],
      toolsItems: [
        'Notion & Obsidian (PKM)',
        'Raspberry Pi & Home Automation',
        'Markdown & Static Site Generators',
        'Podcasts & Tech Newsletters',
        'Various Productivity Frameworks',
      ],
      highlights: [
        'Built a Personal Knowledge Management System in Obsidian',
        'Set up a Home Media Server with Raspberry Pi',
        'Published Articles on Tech and Productivity',
      ],
    },
  ];

  for (const page of topicPages) {
    await prisma.topicPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  // 3. Seed Default Skills into Neon DB
  const defaultSkills = [
    { name: 'JavaScript', category: 'Languages', color: '#F7DF1E' },
    { name: 'TypeScript', category: 'Languages', color: '#3178C6' },
    { name: 'Python', category: 'Languages', color: '#3776AB' },
    { name: 'PHP', category: 'Languages', color: '#777BB4' },
    { name: 'React', category: 'Frameworks & Libraries', color: '#61DAFB' },
    { name: 'Next.js', category: 'Frameworks & Libraries', color: '#F5F5F5' },
    { name: 'Vue.js', category: 'Frameworks & Libraries', color: '#4FC08D' },
    { name: 'Node.js', category: 'Frameworks & Libraries', color: '#339933' },
    { name: 'Tailwind CSS', category: 'Frameworks & Libraries', color: '#06B6D4' },
    { name: 'WordPress', category: 'Frameworks & Libraries', color: '#21759B' },
    { name: 'Laravel', category: 'Frameworks & Libraries', color: '#FF2D20' },
    { name: 'Cypress', category: 'Testing & QA Tools', color: '#17202C' },
    { name: 'Playwright', category: 'Testing & QA Tools', color: '#45ba4b' },
    { name: 'Jest', category: 'Testing & QA Tools', color: '#C21325' },
    { name: 'Postman', category: 'Testing & QA Tools', color: '#FF6C37' },
    { name: 'Notion', category: 'Tools & Productivity', color: '#F5F5F5' },
    { name: 'Git', category: 'Tools & Productivity', color: '#F05032' },
    { name: 'GitHub', category: 'Tools & Productivity', color: '#F5F5F5' },
  ];

  for (const skill of defaultSkills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }

  // 4. Seed Default Experience into Neon DB
  const defaultExperiences = [
    {
      title: 'Software Developer Intern',
      company: '[Company Name]',
      location: 'Remote',
      startDate: 'Sep 2024',
      endDate: 'Dec 2024',
      isCurrent: false,
      description: 'Describe your internship responsibilities, what you built, and the impact you made.',
      tags: ['React', 'Next.js', 'Tailwind CSS'],
    },
    {
      title: 'Freelance Landing Page Designer',
      company: 'Self-Employed',
      location: 'Remote',
      startDate: 'Jan 2025',
      endDate: 'Present',
      isCurrent: true,
      description: 'Describe your freelance work — clients, projects delivered, tools used, and outcomes.',
      tags: ['WordPress', 'Laravel', 'PHP'],
    },
  ];

  for (const exp of defaultExperiences) {
    const existing = await prisma.experience.findFirst({ where: { title: exp.title, company: exp.company } });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }

  console.log('Seeded Skills and Experiences successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
