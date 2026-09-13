export default function InboxPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Inbox
      </h1>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.6 }}>📬</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          Message Center
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          View and manage contact form submissions and direct messages from visitors.
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '24px',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent-primary)' }}>🔗</span>
          <span>Phase 2 will connect to Resend email API for contact form integration.</span>
        </div>
      </div>
    </div>
  );
}
