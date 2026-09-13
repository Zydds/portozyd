export default function PortfolioSection() {
  return (
    <section id="portfolio" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '64px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          Portfolio
        </h2>

        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '80px 32px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.6 }}>📂</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>
            Coming Soon
          </h3>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}>
            I&apos;m currently curating and documenting my best projects to showcase here.
            Check back soon to see detailed case studies, live demos, and code samples.
          </p>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)',
            padding: '16px',
            background: 'var(--accent-ghost)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
          }}>
            💡 In the meantime, explore my hobbies and interests via the navigation menu above.
          </div>
        </div>
      </div>
    </section>
  );
}
