import TopicPageLayout from '@/components/TopicPageLayout';
import TopicLayout from '@/app/topic-layout';

export const revalidate = 60; // ISR: shared layout data refreshes every 60s

export default function WebDevPage() {
  return (
    <TopicLayout>
      <TopicPageLayout
        icon="💻"
        title="Web Development"
        intro="Building modern, scalable, and responsive web applications with a focus on clean code and robust architecture."
        focusTitle="🎯 Key Focus & Philosophy"
        focusItems={[
          'Component-Based Architecture',
          'Responsive & Accessible UI/UX',
          'State Management & Data Flow',
          'SEO & Performance Optimization',
          'Clean, Maintainable Code',
        ]}
        toolsTitle="🛠️ Tools & Technologies"
        toolsItems={[
          'React, Next.js & Vue',
          'Tailwind CSS & Styled Components',
          'Node.js & Express',
          'RESTful APIs & GraphQL',
          'Git, GitHub & Version Control',
        ]}
        highlights={[
          'Full-Stack E-Commerce Platform with Next.js',
          'Interactive Dashboard for Data Visualization',
          'Custom WordPress Theme Development',
        ]}
      />
    </TopicLayout>
  );
}
