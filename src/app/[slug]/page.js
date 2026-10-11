import { cache } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

// Shared between generateMetadata and the page (one query per render).
const getTopic = cache(async (slug) => prisma.topicPage.findUnique({ where: { slug } }));

// No generateStaticParams: prerendered HTML cannot carry per-request CSP
// nonces, so this route renders on demand (root layout calls connection()).
// Unknown slugs are handled by notFound() below.

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) return {};

  try {
    const page = await getTopic(slug);
    if (!page) return {};
    return {
      title: `${page.title} — Zaidan Ghiffari Azhar`,
      description: page.intro,
    };
  } catch {
    return {};
  }
}

export default async function DynamicTopicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  let page = null;
  try {
    page = await getTopic(slug);
  } catch (err) {
    console.error('Error fetching topic page:', err);
  }

  if (!page) {
    notFound();
  }

  return (
    <TopicLayout>
      <TopicPageLayout
        icon={page.icon}
        title={page.title}
        intro={page.intro}
        sections={page.sections || []}
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={page.focusItems || []}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={page.toolsItems || []}
        highlights={page.highlights || []}
      />
    </TopicLayout>
  );
}
