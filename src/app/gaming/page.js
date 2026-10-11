import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';
import { getTopicPage } from '@/lib/home-data';

// Hardcoded fallbacks only apply when the DB row is missing (e.g. fresh env);
// once the row exists, admin edits in /admin/topics/gaming drive this page.
export default async function GamingPage() {
  const topic = await getTopicPage('gaming');

  return (
    <TopicLayout>
      <TopicPageLayout
        icon={topic?.icon || '🎮'}
        title={topic?.title || 'Gaming'}
        intro={
          topic?.intro ||
          'Exploring virtual worlds, competitive strategies, and the technology that powers modern interactive entertainment.'
        }
        sections={topic?.sections || []}
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={topic?.focusItems || [
          'Strategy & Tactical Gameplay',
          'Community Building & Moderation',
          'Game Mechanics Analysis',
          'Hardware Setup & Optimization',
          'Esports & Competitive Scene',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={topic?.toolsItems || [
          'Discord (Server Management)',
          'OBS Studio (Streaming)',
          'Steam & Battle.net',
          'Custom PC Building',
          'Performance Tuning (Overclocking)',
        ]}
        highlights={topic?.highlights || [
          'Managed a 500+ Member Discord Community',
          'Achieved Top 5% Rank in Competitive Strategy Game',
          'Optimized Custom PC Build for 144Hz+ Gaming',
        ]}
      />
    </TopicLayout>
  );
}
