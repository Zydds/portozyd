'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const topicData = {
  qa: {
    title: 'Quality Assurance',
    icon: '🛡️',
    intro: 'Ensuring software reliability, performance, and seamless user experiences through rigorous testing methodologies.',
    focusItems: [
      'Test Plan Design & Documentation',
      'Automated End-to-End Testing',
      'Bug Tracking & Detailed Reports',
      'Usability & Edge Case Testing',
      'Continuous Quality Improvement',
    ],
    toolsItems: [
      'Cypress & Playwright (E2E Testing)',
      'Postman (API Testing)',
      'Jest & React Testing Library',
      'CI/CD Pipeline Integration',
      'Browser DevTools & Debugging',
    ],
  },
  webdev: {
    title: 'Web Development',
    icon: '💻',
    intro: 'Building modern, scalable, and responsive web applications with a focus on clean code and robust architecture.',
    focusItems: [
      'Component-Based Architecture',
      'Responsive & Accessible UI/UX',
      'State Management & Data Flow',
      'SEO & Performance Optimization',
      'Clean, Maintainable Code',
    ],
    toolsItems: [
      'React, Next.js & Vue',
      'Tailwind CSS & Styled Components',
      'Node.js & Express',
      'RESTful APIs & GraphQL',
      'Git, GitHub & Version Control',
    ],
  },
  pm: {
    title: 'Project Management',
    icon: '📊',
    intro: 'Orchestrating teams, workflows, and resources to deliver high-quality software products on time and within budget.',
    focusItems: [
      'Agile & Scrum Methodologies',
      'Requirements Gathering & Scoping',
      'Risk Management & Mitigation',
      'Cross-Functional Team Collaboration',
      'Stakeholder Communication',
    ],
    toolsItems: [
      'Jira & Confluence',
      'Notion & Trello',
      'Asana & Monday.com',
      'Gantt Charts & Roadmapping',
      'Slack, Teams & Zoom',
    ],
  },
  gaming: {
    title: 'Gaming',
    icon: '🎮',
    intro: 'Exploring virtual worlds, competitive strategies, and the technology that powers modern interactive entertainment.',
    focusItems: [
      'Strategy & Tactical Gameplay',
      'Community Building & Moderation',
      'Game Mechanics Analysis',
      'Hardware Setup & Optimization',
      'Esports & Competitive Scene',
    ],
    toolsItems: [
      'Discord (Server Management)',
      'OBS Studio (Streaming)',
      'Steam & Battle.net',
      'Custom PC Building',
      'Performance Tuning (Overclocking)',
    ],
  },
  others: {
    title: 'Other Interests',
    icon: '🌌',
    intro: 'A collection of hobbies, explorations, and continuous learning adventures beyond code and quality assurance.',
    focusItems: [
      'Continuous Learning & Skill Acquisition',
      'Technology & Gadget Exploration',
      'Creative Writing & Blogging',
      'Productivity Systems & Workflows',
      'Open Source Contributions',
    ],
    toolsItems: [
      'Notion & Obsidian (PKM)',
      'Raspberry Pi & Home Automation',
      'Markdown & Static Site Generators',
      'Podcasts & Tech Newsletters',
      'Various Productivity Frameworks',
    ],
  },
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: '10px 12px',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  color: 'var(--text-primary)',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '8px',
};

export default function TopicEditorPage({ params }) {
  const router = useRouter();
  const slug = params.slug;
  const data = topicData[slug] || {};

  const [formData, setFormData] = useState({
    title: data.title || '',
    icon: data.icon || '',
    intro: data.intro || '',
    focusItems: data.focusItems?.join('\n') || '',
    toolsItems: data.toolsItems?.join('\n') || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Save functionality will be connected in Phase 2 (database integration)');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Edit Topic: {formData.title}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label htmlFor="title" style={labelStyle}>Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="icon" style={labelStyle}>Icon (Emoji)</label>
          <input
            id="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="intro" style={labelStyle}>Introduction</label>
          <textarea
            id="intro"
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="focusItems" style={labelStyle}>Key Focus Items (one per line)</label>
          <textarea
            id="focusItems"
            value={formData.focusItems}
            onChange={(e) => setFormData({ ...formData, focusItems: e.target.value })}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="toolsItems" style={labelStyle}>Tools & Technologies (one per line)</label>
          <textarea
            id="toolsItems"
            value={formData.toolsItems}
            onChange={(e) => setFormData({ ...formData, toolsItems: e.target.value })}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'white',
              background: 'var(--accent-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{
          padding: '16px',
          background: 'var(--accent-ghost)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}>
          💡 Note: This is a UI prototype. Save functionality will be connected to the database in Phase 2.
        </div>
      </form>
    </div>
  );
}
