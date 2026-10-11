'use client';

import Image from 'next/image';
import Link from 'next/link';

// Public project card — admin/projects styling (badge row, Spectral italic
// title, mono footer) plus a cover image. The image+text block is the link to
// the detail page; Demo/GitHub live in the footer as siblings so we never
// nest <a> inside <a>.
export default function ProjectCard({ project }) {
  const detailHref = `/portfolio/${project.category}/${project.slug}`;
  const hasDemo = project.demoUrl && project.demoUrl !== '#';
  const hasGithub = project.githubUrl && project.githubUrl !== '#';

  return (
    <div
      className="glow-hover"
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Link
        href={detailHref}
        style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
      >
        {project.imageUrl && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              overflow: 'hidden',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 820px) 100vw, 380px"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {project.category}
            </span>
            {project.featured && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(58, 76, 255, 0.15)',
                  color: 'var(--accent-dim)',
                  border: '1px solid var(--accent)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                FEATURED
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-spectral, serif)',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {project.description}
          </p>
        </div>
      </Link>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          {hasDemo && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--accent-dim)', textDecoration: 'none' }}
            >
              Live ↗
            </a>
          )}
          {hasGithub && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              GitHub ↗
            </a>
          )}
        </div>
        <Link
          href={detailHref}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-tertiary)',
            textDecoration: 'none',
          }}
        >
          view →
        </Link>
      </div>
    </div>
  );
}
