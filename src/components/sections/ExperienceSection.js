'use client';

import { useEffect, useState } from 'react';

const placeholderExperiences = [
  {
    title: 'Software Developer Intern',
    company: '[Company Name]',
    date: 'Sep 2024 – Dec 2024',
    description: 'Describe your internship responsibilities, what you built, and the impact you made.',
    tags: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    title: 'Freelance Landing Page Designer',
    company: 'Self-Employed',
    date: 'Jan 2025 – Present',
    description: 'Describe your freelance work — clients, projects delivered, tools used, and outcomes.',
    tags: ['WordPress', 'Laravel', 'PHP'],
  },
];

function TimelineItem({ title, company, date, description, tags, isLast }) {
  return (
    <div style={{
      position: 'relative',
      paddingBottom: isLast ? 0 : '48px',
      marginBottom: isLast ? 0 : '48px',
      borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
    }}>
      {/* Dot */}
      <div style={{
        position: 'absolute',
        left: '-44px',
        top: '4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: 'var(--accent-primary)',
        border: '3px solid var(--bg-primary)',
        zIndex: 1,
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '0.9375rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
            {company}
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
          {date}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        lineHeight: 1.7,
      }}>
        {description}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExperienceSection() {
  const [items, setItems] = useState(placeholderExperiences);

  useEffect(() => {
    fetch('/api/admin/crud')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.experiences && data.experiences.length > 0) {
          const mapped = data.experiences.map(e => ({
            title: e.title,
            company: e.company,
            date: `${e.startDate} – ${e.isCurrent ? 'Present' : (e.endDate || 'Present')}`,
            description: e.description,
            tags: e.tags || [],
          }));
          setItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="experience" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '64px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          Experience
        </h2>

        <div style={{ position: 'relative', paddingLeft: '48px' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'var(--border-default)',
          }} />

          {items.map((exp, i) => (
            <TimelineItem
              key={i}
              {...exp}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
