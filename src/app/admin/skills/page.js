export default function SkillsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Skills
      </h1>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Skills Manager
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
          Categorize and organize your technical and professional skills. Drag and drop to reorder.
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
          <span style={{ color: 'var(--accent-primary)' }}>📊</span>
          <span>Phase 2 will connect to the database for real-time skill management.</span>
        </div>
      </div>
    </div>
  );
}
