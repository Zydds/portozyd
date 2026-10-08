import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export const revalidate = 60; // ISR: shared layout data refreshes every 60s

export default function GamingPage() {
  return (
    <TopicLayout>
      <TopicPageLayout
        icon="🎮"
        title="Gaming"
        intro="Exploring virtual worlds, competitive strategies, and the technology that powers modern interactive entertainment."
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={[
          'Strategy & Tactical Gameplay',
          'Community Building & Moderation',
          'Game Mechanics Analysis',
          'Hardware Setup & Optimization',
          'Esports & Competitive Scene',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={[
          'Discord (Server Management)',
          'OBS Studio (Streaming)',
          'Steam & Battle.net',
          'Custom PC Building',
          'Performance Tuning (Overclocking)',
        ]}
        highlights={[
          'Managed a 500+ Member Discord Community',
          'Achieved Top 5% Rank in Competitive Strategy Game',
          'Optimized Custom PC Build for 144Hz+ Gaming',
        ]}
      />
    </TopicLayout>
  );
}
