export default function ProfilePage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Profile
      </h1>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Personal Information
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Update your name, bio, avatar, and contact details here. This page will connect to the database in Phase 2.
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Avatar & Branding
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Upload a profile photo and customize your brand colors and logo in Phase 2.
        </p>
      </div>
    </div>
  );
}
