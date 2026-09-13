'use client';

import {
  SiJavascript, SiPython, SiPhp, SiTypescript,
  SiReact, SiNextdotjs, SiVuedotjs, SiNodedotjs,
  SiTailwindcss, SiWordpress, SiLaravel,
  SiCypress, SiJest, SiPostman,
  SiNotion, SiGit, SiGithub,
} from 'react-icons/si';
import { VscBeaker } from 'react-icons/vsc';

const categories = [
  {
    title: 'Languages',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#F5F5F5' },
      { name: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'WordPress', icon: SiWordpress, color: '#21759B' },
      { name: 'Laravel', icon: SiLaravel, color: '#FF2D20' },
    ],
  },
  {
    title: 'Testing & QA Tools',
    skills: [
      { name: 'Cypress', icon: SiCypress, color: '#17202C' },
      { name: 'Playwright', icon: VscBeaker, color: '#45ba4b' },
      { name: 'Jest', icon: SiJest, color: '#C21325' },
      { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
    ],
  },
  {
    title: 'Tools & Productivity',
    skills: [
      { name: 'Notion', icon: SiNotion, color: '#F5F5F5' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub, color: '#F5F5F5' },
    ],
  },
];

function SkillCard({ name, icon: Icon, color }) {
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
      <Icon size={32} color={color} style={{ marginBottom: '12px' }} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {name}
      </span>
    </div>
  );
}

export default function SkillsSection() {
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
