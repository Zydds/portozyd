'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExperiencePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', tags: '' });
  const [message, setMessage] = useState(null);

  const fetchExperience = async () => {
    try {
      const res = await fetch('/api/admin/crud');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Server error'); setLoading(false); return; }
      const data = await res.json();
      setItems(data.experiences || []);
    } catch { setMessage('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExperience(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const tagsArray = typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags;
    const body = editing
      ? { entity: 'experience', id: editing.id, ...formData, tags: tagsArray }
      : { entity: 'experience', ...formData, tags: tagsArray };

    try {
      const res = await fetch('/api/admin/crud', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { setMessage('Saved'); setShowForm(false); setEditing(null); setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', tags: '' }); fetchExperience(); }
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Error'); }
    } catch { setMessage('Network error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      const res = await fetch('/api/admin/crud', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'experience', id }) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      fetchExperience();
    } catch { setMessage('Error deleting'); }
  };

  if (loading) return <div style={{ padding: '32px' }}>Loading...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Experience</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', tags: '' }); }} style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Experience</button>
      </div>

      {message && <div style={{ padding: '10px', marginBottom: '16px', borderRadius: '6px', background: message.includes('success') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.includes('success') ? 'var(--success)' : 'var(--error)' }}>{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Experience</h3>
          <input placeholder="Job Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <input placeholder="Company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <input placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <input placeholder="Start Date (e.g. Sep 2024)" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required style={{ flex: 1, padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            <input placeholder="End Date (e.g. Present)" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.isCurrent} style={{ flex: 1, padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} /> Currently working here
          </label>
          <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <input placeholder="Tags (comma-separated)" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-default)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No experience entries yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>{item.company} &bull; {item.location}</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '4px' }}>{item.startDate} &mdash; {item.isCurrent ? 'Present' : item.endDate}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {item.tags.map((t, idx) => <span key={idx} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{t}</span>)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditing(item); setFormData({ title: item.title, company: item.company, location: item.location || '', startDate: item.startDate, endDate: item.endDate || '', isCurrent: item.isCurrent, description: item.description, tags: item.tags?.join(', ') || '' }); setShowForm(true); }} style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ fontSize: '0.875rem', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
