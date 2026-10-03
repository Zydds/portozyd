import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Fetch fresh data on every request

export default async function AdminDashboard() {
  const [projectCount, topicCount, messageCount] = await Promise.all([
    prisma.project.count(),
    prisma.topicPage.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    { label: 'Projects', value: projectCount },
    { label: 'Topic Pages', value: topicCount },
    { label: 'Messages', value: messageCount },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Welcome to your CMS
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Your CMS is connected to Neon PostgreSQL. Managing content across projects, topic pages, and inbox messages will update this dashboard in real-time.
        </p>
      </div>
    </div>
  );
}
