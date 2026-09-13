import Link from 'next/link';
import { RiArrowLeftLine } from 'react-icons/ri';

export default function TopicPageLayout({ icon, title, intro, focusTitle, focusItems, toolsTitle, toolsItems, highlights }) {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 32px' }}>
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '48px',
        transition: 'color 0.15s ease',
      }}>
        <RiArrowLeftLine size={16} />
        Back to Home
      </Link>

      {/* Hero Block */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{icon}</div>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          {intro}
        </p>
      </div>

      {/* Two Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '80px',
      }}>
        {/* Key Focus */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '32px',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {focusTitle}
          </h2>
          <ul style={{ listStyle: 'none' }}>
            {focusItems.map((item, i) => (
              <li key={i} style={{ padding: '8px 0', color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '32px',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toolsTitle}
          </h2>
          <ul style={{ listStyle: 'none' }}>
            {toolsItems.map((item, i) => (
              <li key={i} style={{ padding: '8px 0', color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '32px', textAlign: 'center' }}>
          📌 Highlighted Projects & Insights
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {highlights.map((highlight, i) => (
            <div key={i} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '20px 24px',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}>
              {highlight}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        padding: '48px 32px',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>
          Interested in Working Together?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Let's discuss how we can elevate your project.
        </p>
        <Link href="/#contact" style={{
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
        }}>
          Get In Touch
        </Link>
      </div>
    </div>
  );
}
