'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', content: '', imageUrl: '', demoUrl: '', githubUrl: '', category: 'Web Dev', featured: false });
  const [message, setMessage] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/crud');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Server error'); setLoading(false); return; }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch { setMessage('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const body = editing
      ? { entity: 'project', id: editing.id, ...formData, slug }
      : { entity: 'project', ...formData, slug };

    try {
      const res = await fetch('/api/admin/crud', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { setMessage('Saved'); setShowForm(false); setEditing(null); setFormData({ title: '', slug: '', description: '', content: '', imageUrl: '', demoUrl: '', githubUrl: '', category: 'Web Dev', featured: false }); fetchProjects(); }
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Error'); }
    } catch { setMessage('Network error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch('/api/admin/crud', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'project', id }) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      fetchProjects();
    } catch { setMessage('Error deleting'); }
  };

  if (loading) return <div style={{ padding: '32px' }}>Loading...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Projects</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ title: '', slug: '', description: '', content: '', imageUrl: '', demoUrl: '', githubUrl: '', category: 'Web Dev', featured: false }); }} style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Project</button>
      </div>

      {message && <div style={{ padding: '10px', marginBottom: '16px', borderRadius: '6px', background: message.includes('success') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.includes('success') ? 'var(--success)' : 'var(--error)' }}>{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Project</h3>
          <input placeholder="Project Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <input placeholder="Short Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <textarea placeholder="Full Content (Markdown / HTML)" rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <input placeholder="Live Demo URL" value={formData.demoUrl} onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} style={{ flex: 1, padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            <input placeholder="GitHub Repo URL" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} style={{ flex: 1, padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ flex: 1, padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              {['Web Dev', 'QA & Testing', 'Project Management', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} /> Featured
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-default)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No projects yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {projects.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
                {item.featured && <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>Featured</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.description}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>{item.category}</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button onClick={() => { setEditing(item); setFormData({ title: item.title, slug: item.slug || '', description: item.description, content: item.content || '', imageUrl: item.imageUrl || '', demoUrl: item.demoUrl || '', githubUrl: item.githubUrl || '', category: item.category || 'Web Dev', featured: item.featured || false }); setShowForm(true); }} style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ fontSize: '0.875rem', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
