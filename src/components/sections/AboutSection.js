'use client';

import { useState, useEffect } from 'react';

const defaultParagraphs = {
  about_p1: "I'm a software quality advocate and web developer based in Indonesia. My journey in tech began with a curiosity about how things work behind the scenes, which naturally led me to quality assurance and full-stack development.",
  about_p2: "I specialize in building reliable, user-friendly web applications while ensuring every detail meets high-quality standards — from automated test suites to responsive interfaces.",
  about_p3: "When I'm not testing or coding, you'll find me exploring new technologies, playing strategy games, or organizing projects with my favorite productivity tools.",
};

export default function AboutSection() {
  const [copy, setCopy] = useState(defaultParagraphs);

  useEffect(() => {
    fetch('/api/details')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.details) {
          setCopy(prev => ({
            about_p1: data.details.about_p1 || prev.about_p1,
            about_p2: data.details.about_p2 || prev.about_p2,
            about_p3: data.details.about_p3 || prev.about_p3,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '48px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          About Me
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Bio */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
              Hello, I&apos;m Zaidan
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
              {copy.about_p1}
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
              {copy.about_p2}
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {copy.about_p3}
            </p>
          </div>

          {/* Education Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '32px',
            transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>
              🎓 Education
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '4px' }}>
                Bachelor&apos;s Degree in Information Technology
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                [Your University Name]
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                [Year] – [Year]
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '4px' }}>
                High School Diploma
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                [Your High School Name]
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                [Year] – [Year]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
