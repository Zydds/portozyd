'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { MediaField } from '@/components/admin/ImagePicker';

const labelStyle = { display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.875rem' };
const textareaStyle = { ...inputStyle, lineHeight: '1.6', resize: 'vertical', minHeight: '96px' };
const cardStyle = { background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '20px' };
const cardTitleStyle = { fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' };
const rowStyle = { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' };
const removeBtnStyle = { padding: '8px 10px', border: '1px solid #EF4444', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', cursor: 'pointer', flexShrink: 0 };
const addBtnStyle = { padding: '8px 14px', border: '1px dashed var(--border-strong)', borderRadius: '6px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' };
const hintStyle = { fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' };

function StringList({ items, onChange, placeholder, ariaLabel }) {
  return (
    <div>
      {items.map((value, i) => (
        <div key={i} style={rowStyle}>
          <input
            aria-label={`${ariaLabel} ${i + 1}`}
            value={value}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: '1 1 260px' }}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <button type="button" aria-label={`Remove ${ariaLabel} ${i + 1}`} style={removeBtnStyle} onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <FiTrash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" style={addBtnStyle} onClick={() => onChange([...items, ''])}>
        <FiPlus size={14} /> Add
      </button>
    </div>
  );
}

export default function RestrictedPage() {
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/restricted');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { const data = await res.json(); setDoc(data.restricted); }
      else setMessage('Failed to load page content');
    } catch { setMessage('Failed to load page content'); }
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const setField = (key, value) => setDoc((d) => ({ ...d, [key]: value }));
  const setLab = (key, value) => setDoc((d) => ({ ...d, lab: { ...d.lab, [key]: value } }));
  const setListField = (key, next) => setDoc((d) => ({ ...d, [key]: next }));
  const setObjListItem = (key, i, patch) =>
    setDoc((d) => ({ ...d, [key]: d[key].map((item, j) => (j === i ? { ...item, ...patch } : item)) }));
  const removeObjListItem = (key, i) => setDoc((d) => ({ ...d, [key]: d[key].filter((_, j) => j !== i) }));

  const save = async () => {
    if (saving || !doc) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/restricted', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restricted: doc }),
      });
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDoc(data.restricted);
        setMessage('Saved — /flag/restricted.html updated');
      } else setMessage(data.error || 'Failed to save');
    } catch { setMessage('Network error'); }
    finally { setSaving(false); }
  };

  if (!doc) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading restricted page content...</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Restricted page</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Content of the honeypot at <code>/flag/restricted.html</code> — every bad URL lands there.</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: saving ? 'var(--text-tertiary)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'default' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--text-tertiary)' }}>{message}</div>}

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Page header</h2>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Title</label>
          <input value={doc.title} onChange={(e) => setField('title', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Subtitle</label>
          <textarea value={doc.subtitle} onChange={(e) => setField('subtitle', e.target.value)} style={textareaStyle} />
        </div>
        <div>
          <label style={labelStyle}>Request-log note</label>
          <textarea value={doc.logNote} onChange={(e) => setField('logNote', e.target.value)} style={textareaStyle} />
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>About me</h2>
        <textarea value={doc.about} onChange={(e) => setField('about', e.target.value)} style={{ ...textareaStyle, minHeight: '120px' }} />
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>What I know</h2>
        <StringList items={doc.knowBullets} onChange={(next) => setListField('knowBullets', next)} placeholder="Bullet point" ariaLabel="Bullet" />
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Tools I have used</h2>
        {doc.tools.map((t, i) => (
          <div key={i} style={rowStyle}>
            <input value={t.name} placeholder="Tool" style={{ ...inputStyle, flex: '1 1 150px' }} onChange={(e) => setObjListItem('tools', i, { name: e.target.value })} />
            <input value={t.use} placeholder="Use" style={{ ...inputStyle, flex: '2 1 260px' }} onChange={(e) => setObjListItem('tools', i, { use: e.target.value })} />
            <select value={t.level} style={{ ...inputStyle, flex: '0 0 120px' }} onChange={(e) => setObjListItem('tools', i, { level: e.target.value })}>
              <option value="basic">basic</option>
              <option value="practical">practical</option>
            </select>
            <button type="button" aria-label={`Remove tool ${i + 1}`} style={removeBtnStyle} onClick={() => removeObjListItem('tools', i)}>
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
        <button type="button" style={addBtnStyle} onClick={() => setListField('tools', [...doc.tools, { name: '', use: '', level: 'basic' }])}>
          <FiPlus size={14} /> Add tool
        </button>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Certifications</h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Section intro</label>
          <input value={doc.certsIntro} onChange={(e) => setField('certsIntro', e.target.value)} style={inputStyle} />
        </div>
        {doc.certs.map((c, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', marginBottom: '12px', background: 'var(--bg)' }}>
            <div style={{ ...rowStyle, justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Certificate {i + 1}</span>
              <button type="button" aria-label={`Remove certificate ${i + 1}`} style={removeBtnStyle} onClick={() => removeObjListItem('certs', i)}>
                <FiTrash2 size={14} />
              </button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>Image (from media library)</label>
              <MediaField value={c.imageUrl} onChange={(url) => setObjListItem('certs', i, { imageUrl: url })} placeholder="https://res.cloudinary.com/..." label="Choose certificate image" />
            </div>
            <div style={rowStyle}>
              <input value={c.caption} placeholder="Caption" style={{ ...inputStyle, flex: '1 1 200px' }} onChange={(e) => setObjListItem('certs', i, { caption: e.target.value })} />
              <input value={c.issuer} placeholder="Issuer, year" style={{ ...inputStyle, flex: '1 1 160px' }} onChange={(e) => setObjListItem('certs', i, { issuer: e.target.value })} />
            </div>
            <input value={c.imageAlt} placeholder="Image alt text (optional)" style={inputStyle} onChange={(e) => setObjListItem('certs', i, { imageAlt: e.target.value })} />
          </div>
        ))}
        <button type="button" style={addBtnStyle} onClick={() => setListField('certs', [...doc.certs, { imageUrl: '', imageAlt: '', caption: '', issuer: '' }])}>
          <FiPlus size={14} /> Add certificate
        </button>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Practice lab</h2>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={doc.lab.status} style={{ ...inputStyle, width: 'auto' }} onChange={(e) => setLab('status', e.target.value)}>
              <option value="in progress">in progress</option>
              <option value="completed">completed</option>
            </select>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <label style={labelStyle}>Write-up title</label>
            <input value={doc.lab.title} onChange={(e) => setLab('title', e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Architecture</label>
          <input value={doc.lab.architecture} onChange={(e) => setLab('architecture', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Red Team (Attacker)</label>
          <textarea value={doc.lab.redTeam} onChange={(e) => setLab('redTeam', e.target.value)} style={textareaStyle} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Blue Team (SIEM)</label>
          <textarea value={doc.lab.blueTeam} onChange={(e) => setLab('blueTeam', e.target.value)} style={textareaStyle} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Key achievements</label>
          <StringList items={doc.lab.achievements} onChange={(next) => setLab('achievements', next)} placeholder="Achievement" ariaLabel="Achievement" />
        </div>
        <div>
          <label style={labelStyle}>Dashboard screenshot (from media library)</label>
          <MediaField value={doc.lab.screenshotUrl} onChange={(url) => setLab('screenshotUrl', url)} placeholder="https://res.cloudinary.com/..." label="Choose screenshot" />
          <p style={hintStyle}>Upload the Splunk dashboard PNG in the Media Library first, then pick it here.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>How this site protects its admin area</h2>
        <StringList items={doc.defenseBullets} onChange={(next) => setListField('defenseBullets', next)} placeholder="Bullet point" ariaLabel="Defense bullet" />
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Contact & footer</h2>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Contact lead-in</label>
          <input value={doc.contactLead} onChange={(e) => setField('contactLead', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Contact email</label>
          <input value={doc.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Footer</label>
          <input value={doc.footer} onChange={(e) => setField('footer', e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: saving ? 'var(--text-tertiary)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'default' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
