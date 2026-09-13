import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export default function PMPage() {
  return (
    <TopicLayout>
      <TopicPageLayout
        icon="📊"
        title="Project Management"
        intro="Orchestrating teams, workflows, and resources to deliver high-quality software products on time and within budget."
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={[
          'Agile & Scrum Methodologies',
          'Requirements Gathering & Scoping',
          'Risk Management & Mitigation',
          'Cross-Functional Team Collaboration',
          'Stakeholder Communication',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={[
          'Jira & Confluence',
          'Notion & Trello',
          'Asana & Monday.com',
          'Gantt Charts & Roadmapping',
          'Slack, Teams & Zoom',
        ]}
        highlights={[
          'Led a Cross-Functional Team to Deliver a Key Product Feature',
          'Implemented Agile Workflows to Increase Team Velocity by 20%',
          'Managed a $50k Budget Software Migration Project',
        ]}
      />
    </TopicLayout>
  );
}
