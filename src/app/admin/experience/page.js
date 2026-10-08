'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function ExperiencePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', startDate: '', endDate: '',
    isCurrent: false, description: '', tags: '',
  });

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/crud');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || `Server error (${res.status})`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setItems(data.experiences || []);
    } catch {
      setMessage('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const body = editing
      ? { entity: 'experience', id: editing.id, ...formData, tags: tagsArray }
      : { title: formData.title, company: formData.company, location: formData.location, startDate: formData.startDate, endDate: formData.endDate, isCurrent: formData.isCurrent, description: formData.description, tags: tagsArray };
    try {
      const res = await fetch('/api/admin/crud', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        setMessage('Saved successfully');
        setShowForm(false);
        setEditing(null);
        setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', tags: '' });
        fetchItems();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || 'Error saving experience');
      }
    } catch {
      setMessage('Failed to send request');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      const res = await fetch('/api/admin/crud', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'experience', id }) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      fetchItems();
    } catch {
      setMessage('Error deleting experience');
    }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading experiences...</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Experience</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', tags: '' }); }} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>+ Add Experience</button>
      </div>
      {message && <div style={{ padding: '10px', marginBottom: '16px', borderRadius: '6px', background: message.includes('success') ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? 'var(--accent-dim)' : 'var(--text-tertiary)' }}>{message}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Experience</h3>
          <input placeholder="Job Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          <input placeholder="Company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          <input placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input type="date" placeholder="Start Date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', flex: '1', minWidth: '140px' }} />
            <input type="date" placeholder="End Date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', flex: '1', minWidth: '140px' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
              Current position
            </label>
          </div>
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', resize: 'vertical' }} />
          <input placeholder="Tags (comma-separated)" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}
      {items.length === 0 ? (
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>No experience records yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map(exp => (
            <div key={exp.id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{exp.title}</span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{exp.startDate} – {exp.isCurrent ? 'Present' : (exp.endDate || 'Present')}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-dim)', marginBottom: '8px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{exp.description}</p>
              {exp.tags && exp.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {exp.tags.map(tag => <span key={tag} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', border: '1px solid var(--border-strong)', padding: '4px 9px', color: 'var(--text-secondary)' }}>#{tag}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => { setEditing(exp); setFormData({ title: exp.title, company: exp.company, location: exp.location || '', startDate: exp.startDate || '', endDate: exp.endDate || '', isCurrent: exp.isCurrent, description: exp.description, tags: exp.tags ? exp.tags.join(', ') : '' }); setShowForm(true); }} style={{ fontSize: '0.75rem', color: 'var(--accent-dim)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(exp.id)} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
