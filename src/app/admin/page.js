import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Fresh counts on mount

export default async function AdminDashboard() {
  const [projectCount, topicCount, messageCount, skillCount, experienceCount] = await Promise.all([
    prisma.project.count(),
    prisma.topicPage.count(),
    prisma.contactMessage.count(),
    prisma.skill.count(),
    prisma.experience.count(),
  ]);

  const stats = [
    { label: 'Projects', value: projectCount, meta: 'case studies' },
    { label: 'Skills', value: skillCount, meta: 'active technologies' },
    { label: 'Experience', value: experienceCount, meta: 'career roles' },
    { label: 'Topic Pages', value: topicCount, meta: 'landing routes' },
    { label: 'Messages', value: messageCount, meta: 'contact submissions' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Dashboard Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            backgroundColor: 'var(--bg-raised, #131316)',
            border: '1px solid var(--border, #232327)',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: 'var(--text-tertiary, #5C5C64)', marginBottom: '8px', textTransform: 'lowercase' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '2.2rem', fontWeight: 500, color: 'var(--text-primary, #EDEDF1)', lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: 'var(--accent-dim, #7C88FF)', marginTop: '8px' }}>
              {stat.meta}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'var(--bg-raised, #131316)',
        border: '1px solid var(--border, #232327)',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Welcome to your CMS
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
          Your CMS is connected to Neon PostgreSQL. Managing content across projects, topic pages, and inbox messages will update this dashboard in real-time.
        </p>
      </div>
    </div>
  );
}
