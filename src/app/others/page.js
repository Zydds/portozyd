import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export const revalidate = 60; // ISR: shared layout data refreshes every 60s

export default function OthersPage() {
  return (
    <TopicLayout>
      <TopicPageLayout
        icon="🌌"
        title="Other Interests"
        intro="A collection of hobbies, explorations, and continuous learning adventures beyond code and quality assurance."
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={[
          'Continuous Learning & Skill Acquisition',
          'Technology & Gadget Exploration',
          'Creative Writing & Blogging',
          'Productivity Systems & Workflows',
          'Open Source Contributions',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={[
          'Notion & Obsidian (PKM)',
          'Raspberry Pi & Home Automation',
          'Markdown & Static Site Generators',
          'Podcasts & Tech Newsletters',
          'Various Productivity Frameworks',
        ]}
        highlights={[
          'Built a Personal Knowledge Management System in Obsidian',
          'Set up a Home Media Server with Raspberry Pi',
          'Published Articles on Tech and Productivity',
        ]}
      />
    </TopicLayout>
  );
}
