'use client';

const placeholderProjects = [
  {
    id: 'p1',
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    category: 'web',
    description: 'Real-time sales analytics and inventory management interface with Next.js & Tailwind CSS.',
    imageUrl: '',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'p2',
    title: 'QA Automation Test Suite',
    slug: 'qa-automation-suite',
    category: 'qa',
    description: 'Comprehensive end-to-end regression and integration testing pipeline with Cypress & Playwright.',
    imageUrl: '',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 'p3',
    title: 'Agile Sprint Tracker',
    slug: 'agile-sprint-tracker',
    category: 'pm',
    description: 'Kanban-based project planning and sprint retrospective workspace with automated Jira sync.',
    imageUrl: '',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
  },
];

export default function PortfolioSection({ projects = [] }) {
  const hasDbProjects = projects.length > 0;
  const shown = hasDbProjects ? projects.slice(0, 3) : placeholderProjects;
  const totalCount = hasDbProjects ? projects.length : placeholderProjects.length;

  return (
    <section id="portfolio" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>Portfolio</h2>
          </div>
          <span className="meta">{totalCount} projects · top 3 featured</span>
        </div>

        {shown.length === 0 ? (
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>No projects published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {shown.map((proj) => (
              <div
                key={proj.id || proj.slug}
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
              >
                <div>
                  {proj.imageUrl && (
                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.68rem',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          border: '1px solid var(--border-strong)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {proj.category || 'project'}
                      </span>
                      {proj.featured && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.65rem',
                            color: 'var(--accent-dim)',
                            background: 'rgba(58, 76, 255, 0.1)',
                            border: '1px solid var(--accent)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          featured
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-spectral, serif)',
                        fontStyle: 'italic',
                        fontSize: '1.3rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: '0 0 10px',
                        lineHeight: 1.3,
                      }}
                    >
                      {proj.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {proj.demoUrl && proj.demoUrl !== '#' && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          color: 'var(--accent-dim)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        Demo ↗
                      </a>
                    )}
                    {proj.githubUrl && proj.githubUrl !== '#' && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>

                  {proj.slug && (
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      #{proj.slug}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
