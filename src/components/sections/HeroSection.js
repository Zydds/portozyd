'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="bg-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Avatar */}
        <div style={{
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '2px solid var(--border-default)',
          margin: '0 auto 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
        }}>
          ZGA
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}>
          Zaidan Ghiffari Azhar
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          marginBottom: '48px',
          lineHeight: 1.5,
        }}>
          Quality Assurance
          <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>·</span>
          Web Development
          <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>·</span>
          Project Management
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <Link
            href="#portfolio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '6px',
              background: 'var(--accent-primary)',
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            View My Work
          </Link>

          <Link
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
