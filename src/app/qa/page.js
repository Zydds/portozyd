import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export const revalidate = 60; // ISR: shared layout data refreshes every 60s

export default function QAPage() {
  return (
    <TopicLayout>
      <TopicPageLayout
        icon="🛡️"
        title="Quality Assurance"
        intro="Ensuring software reliability, performance, and seamless user experiences through rigorous testing methodologies."
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={[
          'Test Plan Design & Documentation',
          'Automated End-to-End Testing',
          'Bug Tracking & Detailed Reports',
          'Usability & Edge Case Testing',
          'Continuous Quality Improvement',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={[
          'Cypress & Playwright (E2E Testing)',
          'Postman (API Testing)',
          'Jest & React Testing Library',
          'CI/CD Pipeline Integration',
          'Browser DevTools & Debugging',
        ]}
        highlights={[
          'Automated E2E Suite for E-Commerce Application',
          'Performance Benchmark Analysis for Web Application',
          'API Contract Testing with Postman Collections',
        ]}
      />
    </TopicLayout>
  );
}
