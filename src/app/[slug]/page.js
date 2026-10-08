import { cache } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export const revalidate = 60; // ISR revalidation every 60s

// Shared between generateMetadata and the page (one query per render).
const getTopic = cache(async (slug) => prisma.topicPage.findUnique({ where: { slug } }));

export async function generateStaticParams() {
  try {
    const pages = await prisma.topicPage.findMany({
      select: { slug: true },
    });
    return pages.map((page) => ({ slug: page.slug }));
  } catch (e) {
    return [];
  }
}

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
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={page.focusItems || []}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={page.toolsItems || []}
        highlights={page.highlights || []}
      />
    </TopicLayout>
  );
}
