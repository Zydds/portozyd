import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import TopicLayout from '@/app/topic-layout';
import { getAllProjects, getProjectDetail } from '@/lib/home-data';
import { CATEGORY_META, VALID_CATEGORIES } from '@/lib/portfolio-meta';

export const revalidate = 300; // ISR: portfolio refreshes every 5 min

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectDetail(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Zaidan Ghiffari Azhar`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { category, slug } = await params;

  const project = await getProjectDetail(slug);
  if (!project) notFound();

  // Canonical URL is derived from the project's own category — a wrong
  // segment in the URL just 308s to the right one instead of 404ing.
  if (project.category !== category) {
    permanentRedirect(`/portfolio/${project.category}/${project.slug}`);
  }
  if (!VALID_CATEGORIES.includes(category)) notFound();

  const meta = CATEGORY_META[category];
  const content = project.content || '';

  return (
    <TopicLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 96px' }}>
        <Link
          href={`/portfolio/${category}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            marginBottom: '40px',
          }}
        >
          ← Back to {meta.label}
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: '1px solid var(--border-strong)',
              padding: '3px 10px',
              borderRadius: '4px',
            }}
          >
            {project.category}
          </span>
          {project.featured && (
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.65rem',
                color: 'var(--accent-dim)',
                background: 'rgba(58, 76, 255, 0.1)',
                border: '1px solid var(--accent)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              featured
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-spectral, serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          {project.title}
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 0 32px',
          }}
        >
          {project.description}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {project.demoUrl && project.demoUrl !== '#' && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Live Demo ↗
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              GitHub ↗
            </a>
          )}
        </div>

        {project.imageUrl && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              marginBottom: '40px',
              background: 'var(--bg-raised)',
            }}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {content && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '32px',
              fontSize: '0.9375rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </div>
        )}
      </div>
    </TopicLayout>
  );
}
