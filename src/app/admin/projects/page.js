'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    category: 'web',
    featured: false,
    order: 0,
  });

  const fetchProjects = async () => {
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
      setProjects(data.projects || []);
    } catch {
      setMessage('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    // Auto-generate slug if creating new or slug matches previous auto-gen
    if (!editing) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, title: val, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, title: val }));
    }
  };

  const openAddForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      imageUrl: '',
      demoUrl: '',
      githubUrl: '',
      category: 'web',
      featured: false,
      order: projects.length,
    });
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (proj) => {
    setEditing(proj);
    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      description: proj.description || '',
      content: proj.content || '',
      imageUrl: proj.imageUrl || '',
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      category: proj.category || 'web',
      featured: Boolean(proj.featured),
      order: typeof proj.order === 'number' ? proj.order : 0,
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing
      ? { entity: 'project', id: editing.id, ...formData }
      : { entity: 'project', ...formData };

    try {
      const res = await fetch('/api/admin/crud', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        setMessage(editing ? 'Project updated successfully' : 'Project created successfully');
        setShowForm(false);
        setEditing(null);
        fetchProjects();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || 'Error saving project');
      }
    } catch {
      setMessage('Failed to send request');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete project "${title}"?`)) return;
    try {
      const res = await fetch('/api/admin/crud', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'project', id }),
      });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        setMessage('Project deleted');
        fetchProjects();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || 'Error deleting project');
      }
    } catch {
      setMessage('Error deleting project');
    }
  };

  if (loading) return <div style={{ padding: '32px', color: 'var(--text-primary)' }}>Loading projects...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', margin: 0 }}>Projects</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Manage portfolio projects, case studies, and featured links.</p>
        </div>
        <button
          onClick={openAddForm}
          style={{
            padding: '10px 20px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          + Add Project
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '6px',
            background: message.toLowerCase().includes('success') || message.toLowerCase().includes('deleted')
              ? 'rgba(58, 76, 255, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: message.toLowerCase().includes('success') || message.toLowerCase().includes('deleted')
              ? '1px solid var(--accent)'
              : '1px solid rgba(239, 68, 68, 0.4)',
            color: message.toLowerCase().includes('success') || message.toLowerCase().includes('deleted')
              ? 'var(--accent-dim)'
              : '#ef4444',
            fontSize: '0.875rem',
          }}
        >
          {message}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
            {editing ? 'Edit Project' : 'Add New Project'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Title *</label>
              <input
                placeholder="e.g. Portfolio CMS Platform"
                value={formData.title}
                onChange={handleTitleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Slug (URL path) *</label>
              <input
                placeholder="e.g. portfolio-cms-platform"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Description (short summary) *</label>
            <input
              placeholder="Brief overview displayed on portfolio cards"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Full Content / Case Study (optional)</label>
            <textarea
              placeholder="Detailed description, architecture overview, features, technologies used..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Image URL</label>
              <input
                placeholder="https://example.com/cover.jpg"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Live Demo URL</label>
              <input
                placeholder="https://app.example.com"
                value={formData.demoUrl}
                onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>GitHub Repo URL</label>
              <input
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
              >
                <option value="web">Web Development (web)</option>
                <option value="qa">Quality Assurance (qa)</option>
                <option value="pm">Project Management (pm)</option>
                <option value="mobile">Mobile (mobile)</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '20px' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
              />
              Feature on home highlights
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {editing ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); }}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>No projects created yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(proj => (
            <div
              key={proj.id}
              style={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(58, 76, 255, 0.15)', color: 'var(--accent-dim)', border: '1px solid var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {proj.description}
                </p>
                {proj.slug && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                    slug: <span style={{ color: 'var(--accent-dim)' }}>/{proj.slug}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-dim)', textDecoration: 'none' }}>
                      Live ↗
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      GitHub ↗
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => openEditForm(proj)}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-dim)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
