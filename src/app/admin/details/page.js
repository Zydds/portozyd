'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave } from 'react-icons/fi';

export default function DetailsPage() {
  const router = useRouter();
  const [details, setDetails] = useState({
    about_p1: '',
    about_p2: '',
    about_p3: '',
    contact_intro: '',
    footer_quote: '',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchDetails = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/details');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        const data = await res.json();
        if (data.details) setDetails(prev => ({ ...prev, ...data.details }));
      }
    } catch { setMsg({ type: 'error', text: 'Failed to load details' }); }
    finally { setLoading(false); }
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchDetails(); }, [fetchDetails]);

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
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { setSaved(true); setMsg({ type: 'success', text: 'Site copy updated successfully!' }); setTimeout(() => setSaved(false), 3000); }
      else { const err = await res.json().catch(() => ({})); setMsg({ type: 'error', text: err.error || 'Failed to update details' }); }
    } catch { setMsg({ type: 'error', text: 'Network connection failed' }); }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading site details...</div>;

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

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Landing Page Details</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Customize all the long-form descriptions and copy across your landing page sections.</p>
        </div>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', background: msg.type === 'success' ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? 'var(--accent-dim)' : 'var(--text-tertiary)', border: `1px solid ${msg.type === 'success' ? 'var(--accent)' : 'var(--border-strong)'}`, fontSize: '0.85rem' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> About Section Paragraphs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Paragraph 1 (Background & Origin)</label><textarea rows={3} value={details.about_p1 || ''} onChange={e => handleChange('about_p1', e.target.value)} style={textareaStyle} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Paragraph 2 (Specialization & Standards)</label><textarea rows={3} value={details.about_p2 || ''} onChange={e => handleChange('about_p2', e.target.value)} style={textareaStyle} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Paragraph 3 (Hobbies & Interests)</label><textarea rows={3} value={details.about_p3 || ''} onChange={e => handleChange('about_p3', e.target.value)} style={textareaStyle} /></div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> Contact Section Intro
          </h2>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Subheading text above the contact form</label><textarea rows={3} value={details.contact_intro || ''} onChange={e => handleChange('contact_intro', e.target.value)} style={textareaStyle} /></div>
        </div>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> Footer Quote / Tagline
          </h2>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Footer description text</label><textarea rows={2} value={details.footer_quote || ''} onChange={e => handleChange('footer_quote', e.target.value)} style={textareaStyle} /></div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.85rem' }}><FiSave size={16} /> Save All Details</button>
          {saved && <span style={{ color: 'var(--accent-dim)', fontSize: '0.85rem' }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}