export default function ProjectsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Projects
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
          Add Project
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '32px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.6 }}>📁</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          No Projects Yet
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Your project showcase will be managed here in Phase 2. Add case studies, screenshots, and descriptions.
        </p>
      </div>
    </div>
  );
}
