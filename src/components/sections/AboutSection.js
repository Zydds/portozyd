'use client';

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '48px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          About Me
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Bio */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
              Hello, I&apos;m Zaidan
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
              I&apos;m a software quality advocate and web developer based in Indonesia.
              My journey in tech began with a curiosity about how things work behind
              the scenes, which naturally led me to quality assurance and full-stack development.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
              I specialize in building reliable, user-friendly web applications while ensuring
              every detail meets high-quality standards — from automated test suites to
              responsive interfaces.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              When I&apos;m not testing or coding, you&apos;ll find me exploring new technologies,
              playing strategy games, or organizing projects with my favorite productivity tools.
            </p>
          </div>

          {/* Education Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '32px',
            transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>
              🎓 Education
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '4px' }}>
                Bachelor&apos;s Degree in Information Technology
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                [Your University Name]
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                [Year] – [Year]
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '4px' }}>
                High School Diploma
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                [Your High School Name]
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                [Year] – [Year]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
