'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFileText, FiSave, FiInfo } from 'react-icons/fi';

const defaultDetails = {
  about_p1: "I'm a software quality advocate and web developer based in Indonesia. My journey in tech began with a curiosity about how things work behind the scenes, which naturally led me to quality assurance and full-stack development.",
  about_p2: "I specialize in building reliable, user-friendly web applications while ensuring every detail meets high-quality standards — from automated test suites to responsive interfaces.",
  about_p3: "When I'm not testing or coding, you'll find me exploring new technologies, playing strategy games, or organizing projects with my favorite productivity tools.",
  contact_intro: "Whether you have a question about QA testing, web development projects, or project management methodologies, feel free to drop a message.",
  footer_quote: "Building reliable software and quality-driven web experiences. Always learning, always improving.",
};

export default function DetailsPage() {
  const router = useRouter();
  const [details, setDetails] = useState(defaultDetails);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchDetails = async () => {
    try {
      const res = await fetch('/api/admin/details');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.details) {
          setDetails(prev => ({
            ...prev,
            ...data.details,
          }));
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (key, value) => {
    setDetails(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setMsg({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details }),
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (res.ok) {
        setSaved(true);
        setMsg({ type: 'success', text: 'Site copy updated successfully!' });
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: err.error || 'Failed to update details' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network connection failed' });
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', color: 'var(--text-primary)' }}>Loading site details...</div>;
  }

  const textareaStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    resize: 'vertical',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Landing Page Details
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Customize all the long-form descriptions and copy across your landing page sections.
          </p>
        </div>
      </div>

      {msg.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '24px',
          background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
          border: `1px solid ${msg.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
          fontSize: '0.875rem',
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* About Section Copy */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFileText size={18} /> About Section Paragraphs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Paragraph 1 (Background &amp; Origin)
              </label>
              <textarea
                rows={3}
                value={details.about_p1 || ''}
                onChange={e => handleChange('about_p1', e.target.value)}
                style={textareaStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Paragraph 2 (Specialization &amp; Standards)
              </label>
              <textarea
                rows={3}
                value={details.about_p2 || ''}
                onChange={e => handleChange('about_p2', e.target.value)}
                style={textareaStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Paragraph 3 (Hobbies &amp; Interests)
              </label>
              <textarea
                rows={3}
                value={details.about_p3 || ''}
                onChange={e => handleChange('about_p3', e.target.value)}
                style={textareaStyle}
              />
            </div>
          </div>
        </div>

        {/* Contact Section Intro */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiInfo size={18} /> Contact Section Intro
          </h2>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Subheading / Description text above the contact form
            </label>
            <textarea
              rows={3}
              value={details.contact_intro || ''}
              onChange={e => handleChange('contact_intro', e.target.value)}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Footer Quote */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiInfo size={18} /> Footer Quote / Tagline
          </h2>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Footer description text
            </label>
            <textarea
              rows={2}
              value={details.footer_quote || ''}
              onChange={e => handleChange('footer_quote', e.target.value)}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 28px',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            <FiSave size={16} /> Save All Details
          </button>
          {saved && <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
