import ProjectCard from '@/components/portfolio/ProjectCard';

// Card grid + section heading, shared by /portfolio and /portfolio/[category].
export default function ProjectGrid({ projects = [], heading, countLabel }) {
  return (
    <section style={{ marginBottom: '64px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-spectral, serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {heading}
        </h2>
        {countLabel && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-tertiary)',
            }}
          >
            {countLabel}
          </span>
        )}
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            No projects in this category yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
          }}
        >
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </section>
  );
}
