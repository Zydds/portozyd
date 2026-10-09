import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Fresh counts on mount

// Rolling window for ProbeLog: bounds table growth and keeps the stats below
// window-relative (probes are inserted on every public request, unbounded).
const PROBE_WINDOW_DAYS = 30;

export default async function AdminDashboard() {
  // revalidate=0 → runs per request, so a fresh window is intended here.
  // eslint-disable-next-line react-hooks/purity
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // eslint-disable-next-line react-hooks/purity
  const windowStart = new Date(Date.now() - PROBE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  try {
    // Indexed on createdAt; runs before the counts so stats exclude pruned rows.
    await prisma.probeLog.deleteMany({ where: { createdAt: { lt: windowStart } } });
  } catch (err) {
    console.error('[admin-dashboard] ProbeLog prune failed:', err);
  }
  const [
    projectCount, topicCount, messageCount, skillCount, experienceCount,
    probeTotal, probe24h, botsBlocked, uniqueIpRows,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.topicPage.count(),
    prisma.contactMessage.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.probeLog.count(),
    prisma.probeLog.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.probeLog.count({ where: { action: 'block' } }),
    // COUNT(DISTINCT ip) in SQL: the old groupBy({ by: ['ip'] }) shipped every
    // distinct IP row to the app just to call .length on it.
    prisma.$queryRaw`SELECT COUNT(DISTINCT ip)::int AS count FROM "ProbeLog"`,
  ]);
  const uniqueIps = uniqueIpRows[0]?.count ?? 0;

  const stats = [
    { label: 'Projects', value: projectCount, meta: 'case studies' },
    { label: 'Skills', value: skillCount, meta: 'active technologies' },
    { label: 'Experience', value: experienceCount, meta: 'career roles' },
    { label: 'Topic Pages', value: topicCount, meta: 'landing routes' },
    { label: 'Messages', value: messageCount, meta: 'contact submissions' },
    { label: 'Threats', value: probeTotal, meta: `${uniqueIps} unique IPs` },
    { label: 'Last 24h', value: probe24h, meta: 'probes logged' },
    { label: 'Bots Blocked', value: botsBlocked, meta: 'bot 404s' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Dashboard Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: '20px', marginBottom: '32px' }}>
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
        <Link href="/admin/threats" style={{ display: 'inline-block', marginTop: '14px', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--accent-dim, #7C88FF)' }}>
          View Threat Board →
        </Link>
      </div>
    </div>
  );
}
