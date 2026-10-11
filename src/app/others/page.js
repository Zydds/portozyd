import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';
import { getTopicPage } from '@/lib/home-data';

export const revalidate = 60; // ISR: shared layout data refreshes every 60s

// Hardcoded fallbacks only apply when the DB row is missing (e.g. fresh env);
// once the row exists, admin edits in /admin/topics/others drive this page.
export default async function OthersPage() {
  const topic = await getTopicPage('others');

  return (
    <TopicLayout>
      <TopicPageLayout
        icon={topic?.icon || '🌌'}
        title={topic?.title || 'Other Interests'}
        intro={
          topic?.intro ||
          'A collection of hobbies, explorations, and continuous learning adventures beyond code and quality assurance.'
        }
        sections={topic?.sections || []}
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={topic?.focusItems || [
          'Continuous Learning & Skill Acquisition',
          'Technology & Gadget Exploration',
          'Creative Writing & Blogging',
          'Productivity Systems & Workflows',
          'Open Source Contributions',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={topic?.toolsItems || [
          'Notion & Obsidian (PKM)',
          'Raspberry Pi & Home Automation',
          'Markdown & Static Site Generators',
          'Podcasts & Tech Newsletters',
          'Various Productivity Frameworks',
        ]}
        highlights={topic?.highlights || [
          'Built a Personal Knowledge Management System in Obsidian',
          'Set up a Home Media Server with Raspberry Pi',
          'Published Articles on Tech and Productivity',
        ]}
      />
    </TopicLayout>
  );
}
