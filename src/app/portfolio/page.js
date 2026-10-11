import TopicLayout from '@/app/topic-layout';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { getAllProjects } from '@/lib/home-data';

export const revalidate = 300; // ISR: portfolio refreshes every 5 min

export const metadata = {
  title: 'Portfolio — Zaidan Ghiffari Azhar',
  description: 'All projects across web development, quality assurance, and project management.',
};

export default async function PortfolioIndexPage() {
  const projects = await getAllProjects();

  return (
    <TopicLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px 96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗂️</div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Portfolio
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Every project I&apos;ve shipped — pick a category or browse them all.
          </p>
        </div>

        <ProjectGrid
          projects={projects}
          heading="All Projects"
          countLabel={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
        />
      </div>
    </TopicLayout>
  );
}
