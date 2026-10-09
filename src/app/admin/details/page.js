'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave } from 'react-icons/fi';
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

export default function DetailsPage() {
  const router = useRouter();
  const [details, setDetails] = useState({
    hero_tagline: '',
    hero_focus: '',
    hero_status: '',
    hero_cta_primary_label: '',
    hero_cta_primary_href: '',
    hero_cta_secondary_label: '',
    hero_cta_secondary_href: '',
    hero_video_url: '',
    hero_poster_url: '',
    about_title: '',
    about_quote: '',
    about_p1: '',
    about_p2: '',
    about_p3: '',
    edu_1_title: '',
    edu_1_place: '',
    edu_1_years: '',
    edu_1_image: '',
    edu_2_title: '',
    edu_2_place: '',
    edu_2_years: '',
    edu_2_image: '',
    experience_title: '',
    skills_title: '',
    portfolio_title: '',
    portfolio_meta: '',
    portfolio_empty: '',
    contact_title: '',
    contact_form_meta: '',
    contact_intro: '',
    footer_brand: '',
    footer_quote: '',
    site_title: '',
    social_facebook_url: '',
    social_instagram_url: '',
    social_x_url: '',
    social_telegram_url: '',
    social_discord_url: '',
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
      if (res.ok) { setSaved(true); setMsg({ type: 'success', text: 'Site copy updated — landing page refreshed.' }); setTimeout(() => setSaved(false), 3000); }
      else { const err = await res.json().catch(() => ({})); setMsg({ type: 'error', text: err.error || 'Failed to update details' }); }
    } catch { setMsg({ type: 'error', text: 'Network connection failed' }); }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading site details...</div>;

  // Element factories (not components) keep intrinsic element identity stable,
  // so inputs don't remount and lose focus while typing.
  const lbl = (text, hint) => (
    <div>
      <label style={labelStyle}>{text}</label>
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
  const input = (key, placeholder = '') => (
    <input value={details[key] || ''} placeholder={placeholder} onChange={e => handleChange(key, e.target.value)} style={inputStyle} />
  );
  const area = (key, rows = 3, placeholder = '') => (
    <textarea rows={rows} value={details[key] || ''} placeholder={placeholder} onChange={e => handleChange(key, e.target.value)} style={textareaStyle} />
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
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Landing Page Details</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Every headline, label, and empty-state line on your landing page — no code required.</p>
        </div>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', background: msg.type === 'success' ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? 'var(--accent-dim)' : 'var(--text-tertiary)', border: `1px solid ${msg.type === 'success' ? 'var(--accent)' : 'var(--border-strong)'}`, fontSize: '0.85rem' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {group('Hero Section', <>
          <div>{lbl('Tagline', 'The big line under your name.')}{area('hero_tagline', 2)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Focus', 'Under the "Focus" label.')}{input('hero_focus')}</div>
            <div>{lbl('Status', 'Under the "Status" label.')}{input('hero_status')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Primary CTA label')}{input('hero_cta_primary_label')}</div>
            <div>{lbl('Primary CTA href', 'Anchor (#contact) or full URL.')}{input('hero_cta_primary_href')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Secondary CTA label')}{input('hero_cta_secondary_label')}</div>
            <div>{lbl('Secondary CTA href')}{input('hero_cta_secondary_href')}</div>
          </div>
          <div>
            {lbl('Hero video', 'MP4 upload from the library or any direct URL.')}
            <MediaField value={details.hero_video_url || ''} onChange={v => handleChange('hero_video_url', v)} placeholder="/videos/me-static.mp4 or https://…" label="Choose video" />
          </div>
          <div>
            {lbl('Hero video poster', 'Thumbnail shown before the video plays.')}
            <MediaField value={details.hero_poster_url || ''} onChange={v => handleChange('hero_poster_url', v)} placeholder="/videos/me-static-poster.webp or https://…" label="Choose image" />
          </div>
        </>)}

        {group('About Section', <>
          <div>{lbl('Heading')}{input('about_title')}</div>
          <div>{lbl('Blockquote', 'The italic quote above the paragraphs.')}{area('about_quote', 2)}</div>
          <div>{lbl('Paragraph 1 (Background & Origin)')}{area('about_p1')}</div>
          <div>{lbl('Paragraph 2 (Specialization & Standards)')}{area('about_p2')}</div>
          <div>{lbl('Paragraph 3 (Hobbies & Interests)')}{area('about_p3')}</div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Education — entry 1</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>{lbl('Degree / Title')}{input('edu_1_title')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>{lbl('School / Place')}{input('edu_1_place')}</div>
                <div>{lbl('Years')}{input('edu_1_years', 'e.g. 2020 – 2024')}</div>
              </div>
              <div>
                {lbl('Photo / crest', 'Optional — 56px thumbnail on the landing card.')}
                <MediaField value={details.edu_1_image || ''} onChange={v => handleChange('edu_1_image', v)} placeholder="Direct image URL…" label="Choose image" />
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Education — entry 2</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>{lbl('Degree / Title')}{input('edu_2_title')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>{lbl('School / Place')}{input('edu_2_place')}</div>
                <div>{lbl('Years')}{input('edu_2_years', 'e.g. 2017 – 2020')}</div>
              </div>
              <div>
                {lbl('Photo / crest', 'Optional — 56px thumbnail on the landing card.')}
                <MediaField value={details.edu_2_image || ''} onChange={v => handleChange('edu_2_image', v)} placeholder="Direct image URL…" label="Choose image" />
              </div>
            </div>
          </div>
        </>)}

        {group('Section Headings', <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Experience heading')}{input('experience_title')}</div>
            <div>{lbl('Skills heading')}{input('skills_title')}</div>
          </div>
          <div>{lbl('Portfolio heading')}{input('portfolio_title')}</div>
          <div>{lbl('Portfolio meta suffix', 'Shown after the live project count: "3 projects · <this text>".')}{input('portfolio_meta')}</div>
          <div>{lbl('Portfolio empty state', 'Shown when no projects are published.')}{input('portfolio_empty')}</div>
        </>)}

        {group('Contact Section', <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>{lbl('Heading')}{input('contact_title')}</div>
            <div>{lbl('Form status label', 'The meta chip next to the heading.')}{input('contact_form_meta')}</div>
          </div>
          <div>{lbl('Intro paragraph', 'Above the contact form.')}{area('contact_intro')}</div>
        </>)}

        {group('Footer & SEO', <>
          <div>{lbl('Footer brand', 'The logo text at the top of the footer.')}{input('footer_brand')}</div>
          <div>{lbl('Footer quote', 'Description under the footer brand.')}{area('footer_quote', 2)}</div>
          <div>{lbl('Site title', 'Browser tab title and social preview card.')}{input('site_title', 'ZYD — Quality Assurance & Web Development')}</div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Social links</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '0 0 12px' }}>Appended to the footer icons after GitHub, LinkedIn, and Email. Leave empty to hide an icon.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>{lbl('Facebook URL')}{input('social_facebook_url', 'https://facebook.com/yourprofile')}</div>
                <div>{lbl('Instagram URL')}{input('social_instagram_url', 'https://instagram.com/yourprofile')}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>{lbl('X (Twitter) URL')}{input('social_x_url', 'https://x.com/yourhandle')}</div>
                <div>{lbl('Telegram URL')}{input('social_telegram_url', 'https://t.me/yourhandle')}</div>
              </div>
              <div>{lbl('Discord URL')}{input('social_discord_url', 'https://discord.gg/invite')}</div>
            </div>
          </div>
        </>)}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.85rem' }}><FiSave size={16} /> Save All Details</button>
          {saved && <span style={{ color: 'var(--accent-dim)', fontSize: '0.85rem' }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}
