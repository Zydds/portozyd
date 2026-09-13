export default function ExperiencePage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Experience
        </h1>
        <button style={{
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'white',
          background: 'var(--accent-primary)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}>
          Add Entry
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px', opacity: 0.6 }}>💼</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          Timeline Manager
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Manage your work history and professional timeline here. Add positions, responsibilities, and tags for each role.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--accent-primary)' }}>💡</span>
          <span>Phase 2 will enable full CRUD operations for experience entries.</span>
        </div>
      </div>
    </div>
  );
}
