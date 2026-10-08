'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function TopicEditorPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    intro: '',
    focusItems: '',
    toolsItems: '',
    highlights: '',
  });

  useEffect(() => {
    if (!slug) return;
    async function fetchTopic() {
      try {
        const res = await fetch(`/api/topics/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || '',
            icon: data.icon || '',
            intro: data.intro || '',
            focusItems: data.focusItems?.join('\n') || '',
            toolsItems: data.toolsItems?.join('\n') || '',
            highlights: data.highlights?.join('\n') || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch topic:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/topics/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('✅ Saved successfully to Neon PostgreSQL database!');
      } else {
        setMessage('❌ Error saving changes.');
      }
    } catch (err) {
      setMessage('❌ Failed to connect to server.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--bg-tertiary)',
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

  if (loading) {
    return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-secondary)' }}>Loading topic data...</div>;
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
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
          ← Back to Topics
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Edit Topic: {formData.title || slug}
        </h1>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          backgroundColor: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.includes('✅') ? 'var(--success)' : 'var(--error)'}`,
          color: message.includes('✅') ? 'var(--success)' : 'var(--error)',
          marginBottom: '24px',
          fontSize: '0.875rem',
        }}>
          {message}
        </div>
      )}

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
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="toolsItems" style={labelStyle}>Tools &amp; Technologies (one per line)</label>
          <textarea
            id="toolsItems"
            value={formData.toolsItems}
            onChange={(e) => setFormData({ ...formData, toolsItems: e.target.value })}
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="highlights" style={labelStyle}>Highlighted Projects (one per line)</label>
          <textarea
            id="highlights"
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'white',
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save to Database'}
          </button>
        </div>
      </form>
    </div>
  );
}
