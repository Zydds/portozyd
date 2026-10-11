import { notFound } from 'next/navigation';
import TopicLayout from '@/app/topic-layout';
import TopicPageLayout from '@/components/TopicPageLayout';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { getProjectsByCategory, getTopicPage } from '@/lib/home-data';
import { CATEGORY_META } from '@/lib/portfolio-meta';

// No generateStaticParams: prerendered HTML cannot carry per-request CSP
// nonces, so categories render on demand (root layout calls connection());
// unknown ones hit notFound() in the page below.

export async function generateMetadata({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};
  return {
    title: `${meta.label} Projects — Zaidan Ghiffari Azhar`,
    description: `Featured ${meta.label.toLowerCase()} projects, case studies, and work.`,
  };
}

export default async function PortfolioCategoryPage({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) notFound();

  const [projects, topic] = await Promise.all([
    getProjectsByCategory(category),
    meta.topicSlug ? getTopicPage(meta.topicSlug) : Promise.resolve(null),
  ]);

  return (
    <TopicLayout>
      <TopicPageLayout
        icon={topic?.icon || meta.icon}
        title={topic?.title || meta.label}
        intro={topic?.intro}
        sections={topic?.sections || []}
        backHref="/portfolio"
        backLabel="All Projects"
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={topic?.focusItems || []}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={topic?.toolsItems || []}
        highlights={topic?.highlights || []}
        paddingTop="40px"
      >
        <ProjectGrid
          projects={projects}
          heading="My Projects"
          countLabel={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
        />
      </TopicPageLayout>
    </TopicLayout>
  );
}
