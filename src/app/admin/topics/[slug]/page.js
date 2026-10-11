'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { MediaField } from '@/components/admin/ImagePicker';

const labelStyle = { display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' };
const hintStyle = { fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.875rem' };
const textareaStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  background: 'var(--bg)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '0.875rem',
  lineHeight: '1.6',
  resize: 'vertical',
};
const cardStyle = { background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' };
const cardTitleStyle = { fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };
const miniLabelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const iconBtnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '28px', height: '28px', padding: 0,
  background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px',
  color: 'var(--text-secondary)', cursor: 'pointer',
};
const emptySection = () => ({ heading: '', body: '', mediaUrl: '', ratio: '3:1', mediaSide: 'right' });

const RATIO_OPTIONS = [
  { value: '3:1', label: '3:1  (text 75% / media 25%)' },
  { value: '2:1', label: '2:1  (text 66% / media 33%)' },
  { value: '1:1', label: '1:1  (text 50% / media 50%)' },
  { value: '1:2', label: '1:2  (text 33% / media 66%)' },
  { value: '1:3', label: '1:3  (text 25% / media 75%)' },
];
const SIDE_OPTIONS = [
  { value: 'right', label: 'Media on the right' },
  { value: 'left', label: 'Media on the left' },
];

export default function TopicEditorPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({ title: '', icon: '', intro: '' });
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!slug) return;
    async function fetchTopic() {
      try {
        // no-store: the public endpoint sends max-age=60, which would serve a
        // stale copy of the row right after a save.
        const res = await fetch(`/api/topics/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || '',
            icon: data.icon || '',
            intro: data.intro || '',
          });
          setSections(
            (Array.isArray(data.sections) ? data.sections : []).map((s) => ({
              heading: s?.heading || '',
              body: s?.body || '',
              mediaUrl: s?.mediaUrl || '',
              ratio: s?.ratio || '3:1',
              mediaSide: s?.mediaSide === 'left' ? 'left' : 'right',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch topic:', err);
        setMsg({ type: 'error', text: 'Failed to load topic.' });
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [slug]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setMsg({ type: '', text: '' });
  };

  const updateSection = (index, key, value) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
    setSaved(false);
    setMsg({ type: '', text: '' });
  };

  const addSection = () => setSections((prev) => [...prev, emptySection()]);
  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));
  const moveSection = (index, dir) =>
    setSections((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) return;
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch(`/api/admin/topics/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sections }),
      });

      if (res.ok) {
        setSaved(true);
        setMsg({ type: 'success', text: 'Topic page updated — public page refreshed.' });
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: err.error || 'Failed to update topic.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network connection failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading topic...</div>;

  // Element factories (not components) keep intrinsic element identity stable,
  // so inputs don't remount and lose focus while typing.
  const lbl = (text, hint) => (
    <div>
      <label style={labelStyle}>{text}</label>
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
  const input = (key, placeholder = '') => (
    <input value={formData[key] || ''} placeholder={placeholder} onChange={(e) => handleChange(key, e.target.value)} style={inputStyle} />
  );
  const group = (title, children) => (
    <div style={cardStyle}>
      <h2 style={cardTitleStyle}><span className="icon-chip"></span> {title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/topics')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '8px' }}
          >
            ← Back to Topics
          </button>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>
            Edit Topic{formData.title ? `: ${formData.title}` : ''}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Blog-style page sections — text on the left, an optional image or video on the right.
          </p>
        </div>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', background: msg.type === 'success' ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? 'var(--accent-dim)' : 'var(--text-tertiary)', border: `1px solid ${msg.type === 'success' ? 'var(--accent)' : 'var(--border-strong)'}`, fontSize: '0.85rem' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {group('Topic Details', <>
          <div>{lbl('Title')}{input('title')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Icon (Emoji)', 'Shown above the title on the public page.')}{input('icon', '🛡️')}</div>
          </div>
          <div>{lbl('Introduction', 'The line under the title.')}{input('intro')}</div>
        </>)}

        {group('Page Sections', <>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0 }}>
            Each section splits into a text band and a media band. Pick the ratio and which side
            the media sits on below. Media is optional — sections without it span the full width.
          </p>

          {sections.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0 }}>No sections yet — add your first one below.</p>
          )}

          {sections.map((section, i) => (
            <div key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', paddingTop: i > 0 ? '16px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={miniLabelStyle}>Section {i + 1}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} style={{ ...iconBtnStyle, opacity: i === 0 ? 0.4 : 1 }} aria-label="Move section up">
                    <FiArrowUp size={13} />
                  </button>
                  <button type="button" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} style={{ ...iconBtnStyle, opacity: i === sections.length - 1 ? 0.4 : 1 }} aria-label="Move section down">
                    <FiArrowDown size={13} />
                  </button>
                  <button type="button" onClick={() => removeSection(i)} style={{ ...iconBtnStyle, color: 'var(--text-tertiary)' }} aria-label="Remove section">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>{lbl('Heading')}<input value={section.heading} placeholder="e.g. Automated Testing in Practice" onChange={(e) => updateSection(i, 'heading', e.target.value)} style={inputStyle} /></div>
                <div>
                  {lbl('Body', 'Separate paragraphs with a blank line.')}
                  <textarea rows={6} value={section.body} onChange={(e) => updateSection(i, 'body', e.target.value)} style={textareaStyle} />
                </div>
                <div>
                  {lbl('Image or video', 'Shown in the media band of the section.')}
                  <MediaField
                    value={section.mediaUrl}
                    onChange={(v) => updateSection(i, 'mediaUrl', v)}
                    placeholder="Direct image/video URL…"
                    label="Choose image or video"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    {lbl('Split ratio', 'How the section splits between text and media.')}
                    <select value={section.ratio} onChange={(e) => updateSection(i, 'ratio', e.target.value)} style={inputStyle}>
                      {RATIO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    {lbl('Media position', 'Which side the picture/video sits on.')}
                    <select value={section.mediaSide} onChange={(e) => updateSection(i, 'mediaSide', e.target.value)} style={inputStyle}>
                      {SIDE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '12px',
              background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: '6px',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <FiPlus size={15} /> Add Section
          </button>
        </>)}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" disabled={saving} style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Topic'}
          </button>
          {saved && <span style={{ color: 'var(--accent-dim)', fontSize: '0.85rem' }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}
