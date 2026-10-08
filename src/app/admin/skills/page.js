'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SkillIcon from '@/components/SkillIcon';

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Languages', iconKey: '', color: '#6366F1' });
  const [message, setMessage] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/crud?entity=skill');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) { const errData = await res.json().catch(() => ({})); setMessage(errData.error || `Server error (${res.status})`); setLoading(false); return; }
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (err) { setMessage('Network error connecting to server'); }
    finally { setLoading(false); }
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { entity: 'skill', id: editing.id, name: formData.name, category: formData.category, iconKey: formData.iconKey, color: formData.color } : { entity: 'skill', ...formData };
    try {
      const res = await fetch('/api/admin/crud', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { setMessage('Saved successfully'); setShowForm(false); setEditing(null); setFormData({ name: '', category: 'Languages', iconKey: '', color: '#6366F1' }); fetchSkills(); }
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Error saving skill'); }
    } catch { setMessage('Failed to send request'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      const res = await fetch('/api/admin/crud', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity: 'skill', id }) });
      if (res.status === 401) { router.push('/admin/login'); return; }
      fetchSkills();
    } catch { setMessage('Error deleting skill'); }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading skills...</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Skills</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', category: 'Languages', iconKey: '', color: '#6366F1' }); }} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>+ Add Skill</button>
      </div>
      {message && <div style={{ padding: '10px', marginBottom: '16px', borderRadius: '6px', background: message.includes('success') ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? 'var(--accent-dim)' : 'var(--text-tertiary)' }}>{message}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Skill</h3>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }}>
            {['Languages', 'Frameworks & Libraries', 'Testing & QA Tools', 'Tools & Productivity', 'Soft Skills'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Choose Icon or Enter Slug</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '6px', maxHeight: '100px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', background: 'var(--bg)', marginBottom: '8px' }}>
              {[
                { label: 'JavaScript', icon: 'SiJavascript' }, { label: 'TypeScript', icon: 'SiTypescript' }, { label: 'Python', icon: 'SiPython' }, { label: 'PHP', icon: 'SiPhp' }, { label: 'React', icon: 'SiReact' }, { label: 'Next.js', icon: 'SiNextdotjs' }, { label: 'Vue.js', icon: 'SiVuedotjs' }, { label: 'Node.js', icon: 'SiNodedotjs' }, { label: 'Tailwind', icon: 'SiTailwindcss' }, { label: 'WordPress', icon: 'SiWordpress' }, { label: 'Laravel', icon: 'SiLaravel' }, { label: 'Cypress', icon: 'SiCypress' }, { label: 'Playwright', icon: 'VscBeaker' }, { label: 'Jest', icon: 'SiJest' }, { label: 'Postman', icon: 'SiPostman' }, { label: 'Notion', icon: 'SiNotion' }, { label: 'Git', icon: 'SiGit' }, { label: 'GitHub', icon: 'SiGithub' }, { label: 'Jira', icon: 'SiJira' }, { label: 'Figma', icon: 'SiFigma' }, { label: 'Docker', icon: 'SiDocker' }, { label: 'Kubernetes', icon: 'SiKubernetes' }, { label: 'Linux', icon: 'SiLinux' }, { label: 'Apple', icon: 'SiApple' }, { label: 'Android', icon: 'SiAndroid' }, { label: 'Trello', icon: 'SiTrello' }, { label: 'Confluence', icon: 'SiConfluence' }, { label: 'Office', icon: 'SiApacheopenoffice' }, { label: 'Canva', icon: 'SiCanva' }, { label: 'Beaker', icon: 'VscBeaker' },
              ].map(({ label }) => (
                <button key={label} type="button" onClick={() => setFormData({ ...formData, iconKey: label })} style={{ background: formData.iconKey === label ? 'var(--accent)' : 'transparent', border: formData.iconKey === label ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={label}>{label.slice(0, 2)}</button>
              ))}
            </div>
            <input placeholder="Or type custom SimpleIcon slug (e.g. gitlab, supabase, linear, rust)" value={formData.iconKey} onChange={e => setFormData({ ...formData, iconKey: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.8125rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live Preview:</span>
              <SkillIcon name={formData.name || 'Preview'} iconKey={formData.iconKey} color={formData.color} size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Color:</label>
            <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 170px), 1fr))', gap: '16px' }}>
        {skills.map(skill => (
          <div key={skill.id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <SkillIcon name={skill.name} iconKey={skill.iconKey} color={skill.color || '#6366F1'} size={32} />
            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{skill.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{skill.category}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button onClick={() => { setEditing(skill); setFormData({ name: skill.name, category: skill.category, iconKey: skill.iconKey || '', color: skill.color || '#6366F1' }); setShowForm(true); }} style={{ fontSize: '0.75rem', color: 'var(--accent-dim)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(skill.id)} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}