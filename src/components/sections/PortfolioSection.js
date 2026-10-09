'use client';

import Image from 'next/image';

export default function PortfolioSection({ projects = [], details = {} }) {
  const sectionTitle = details.portfolio_title || 'Portfolio';
  const metaSuffix = details.portfolio_meta || 'top 3 featured';
  const emptyText = details.portfolio_empty || 'No projects published yet.';
  const shown = projects.slice(0, 3);
  const totalCount = projects.length;

  return (
    <section id="portfolio" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>{sectionTitle}</h2>
          </div>
          {totalCount > 0 && <span className="meta">{totalCount} projects · {metaSuffix}</span>}
        </div>

        {shown.length === 0 ? (
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>{emptyText}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {shown.map((proj) => (
              <div
                key={proj.id || proj.slug}
                className="glow-hover"
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {proj.imageUrl && (
                    <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 820px) 100vw, 380px"
                        style={{ objectFit: 'cover' }}
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
