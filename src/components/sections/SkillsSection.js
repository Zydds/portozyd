'use client';

import { useEffect, useState } from 'react';
import {
  SiJavascript, SiPython, SiPhp, SiTypescript,
  SiReact, SiNextdotjs, SiVuedotjs, SiNodedotjs,
  SiTailwindcss, SiWordpress, SiLaravel,
  SiCypress, SiJest, SiPostman,
  SiNotion, SiGit, SiGithub, SiJira,
  SiFigma, SiDocker, SiKubernetes,
  SiLinux, SiApple, SiAndroid,
  SiTrello, SiConfluence,
} from 'react-icons/si';
import { VscBeaker } from 'react-icons/vsc';

const placeholderCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'JavaScript', color: '#F7DF1E' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Python', color: '#3776AB' },
      { name: 'PHP', color: '#777BB4' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Next.js', color: '#F5F5F5' },
      { name: 'Vue.js', color: '#4FC08D' },
      { name: 'Node.js', color: '#339933' },
      { name: 'Tailwind CSS', color: '#06B6D4' },
      { name: 'WordPress', color: '#21759B' },
      { name: 'Laravel', color: '#FF2D20' },
    ],
  },
  {
    title: 'Testing & QA Tools',
    skills: [
      { name: 'Cypress', color: '#17202C' },
      { name: 'Playwright', color: '#45ba4b' },
      { name: 'Jest', color: '#C21325' },
      { name: 'Postman', color: '#FF6C37' },
    ],
  },
  {
    title: 'Tools & Productivity',
    skills: [
      { name: 'Notion', color: '#F5F5F5' },
      { name: 'Git', color: '#F05032' },
      { name: 'GitHub', color: '#F5F5F5' },
    ],
  },
];

const skillIconMap = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  PHP: SiPhp,
  React: SiReact,
  'Next.js': SiNextdotjs,
  'Vue.js': SiVuedotjs,
  'Node.js': SiNodedotjs,
  'Tailwind CSS': SiTailwindcss,
  WordPress: SiWordpress,
  Laravel: SiLaravel,
  Cypress: SiCypress,
  Playwright: VscBeaker,
  Jest: SiJest,
  Postman: SiPostman,
  Notion: SiNotion,
  Git: SiGit,
  GitHub: SiGithub,
  Jira: SiJira,
  Figma: SiFigma,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Linux: SiLinux,
  Apple: SiApple,
  Android: SiAndroid,
  Trello: SiTrello,
  Confluence: SiConfluence,
};

const defaultColors = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  PHP: '#777BB4',
  React: '#61DAFB',
  'Next.js': '#F5F5F5',
  'Vue.js': '#4FC08D',
  'Node.js': '#339933',
  'Tailwind CSS': '#06B6D4',
  WordPress: '#21759B',
  Laravel: '#FF2D20',
  Cypress: '#17202C',
  Playwright: '#45ba4b',
  Jest: '#C21325',
  Postman: '#FF6C37',
  Notion: '#F5F5F5',
  Git: '#F05032',
  GitHub: '#F5F5F5',
  Jira: '#0052CC',
  Figma: '#F24E1E',
  Docker: '#2496ED',
  Trello: '#0079BF',
};

function SkillCard({ name, color, iconKey }) {
  const Icon = skillIconMap[iconKey] || skillIconMap[name] || SiJavascript;
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Icon size={32} color={color || defaultColors[name] || '#6366F1'} style={{ marginBottom: '12px' }} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {name}
      </span>
    </div>
  );
}

function buildCategoriesFromDB(skills) {
  const map = {};
  skills.forEach(s => {
    const cat = s.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push({ name: s.name, color: s.color || defaultColors[s.name] || '#6366F1', iconKey: s.iconKey || '' });
  });
  return Object.entries(map).map(([title, skills]) => ({ title, skills }));
}

export default function SkillsSection() {
  const [categories, setCategories] = useState(placeholderCategories);

  useEffect(() => {
    fetch('/api/admin/crud')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.skills && data.skills.length > 0) {
          setCategories(buildCategoriesFromDB(data.skills));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="skills" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '64px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          Skills &amp; Technologies
        </h2>

        {categories.map(({ title, skills }) => (
          <div key={title} style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '24px',
              color: 'var(--text-primary)',
            }}>
              {title}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '16px',
            }}>
              {skills.map(skill => (
                <SkillCard key={skill.name} {...skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
