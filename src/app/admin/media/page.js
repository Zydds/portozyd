'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiTrash2, FiCopy, FiCheck, FiExternalLink, FiImage } from 'react-icons/fi';

export default function MediaPage() {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ filename: '', url: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { const data = await res.json(); setMedia(data.media || []); }
    } catch { setMessage('Failed to load media assets'); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchMedia(); }, []);

  const handleAddMedia = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: formData.filename, url: formData.url.trim() }),
      });
      if (res.ok) { setFormData({ filename: '', url: '' }); setShowAddForm(false); fetchMedia(); }
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Failed to add media'); }
    } catch { setMessage('Network error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) fetchMedia();
    } catch { setMessage('Error deleting media'); }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div style={{ padding: '32px', color: 'var(--text-primary)' }}>Loading media library...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Media Library</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Store, view, and copy direct image URLs for your projects and topic pages.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif' }}>
          <FiUpload size={16} /> {showAddForm ? 'Close Form' : 'Add Image URL'}
        </button>
      </div>

      {message && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--text-tertiary)' }}>{message}</div>}

      {showAddForm && (
        <form onSubmit={handleAddMedia} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Register Direct Image Asset</h3>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Label / Filename</label><input required placeholder="e.g. Hero Preview" value={formData.filename} onChange={e => setFormData({ ...formData, filename: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Direct Image URL</label><input required placeholder="Paste direct image link ending in .jpg/.png" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>💡 Right-click any photo and select &quot;Copy image address&quot;.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Asset</button>
            <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {media.length === 0 ? (
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>No media assets saved yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Add direct image links to preview and reuse them across your Projects and Topics.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {media.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <img src={item.url} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
                <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-tertiary)' }}><FiImage size={24} /><span style={{ fontSize: '0.75rem' }}>Image Link</span></div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.filename}>{item.filename}</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                  <button onClick={() => copyToClipboard(item.url, item.id)} style={{ flex: 1, padding: '6px 10px', background: copiedId === item.id ? 'var(--accent)' : 'var(--bg)', color: copiedId === item.id ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>{copiedId === item.id ? <FiCheck size={12} /> : <FiCopy size={12} />} {copiedId === item.id ? 'Copied' : 'Copy URL'}</button>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="Open URL"><FiExternalLink size={12} /></a>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--text-tertiary)', borderRadius: '4px', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete"><FiTrash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}