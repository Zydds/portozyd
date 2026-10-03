'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { FiUser, FiSave, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    bio: '',
    avatar: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setProfile({
            name: data.user.name || '',
            email: data.user.email || '',
            role: data.user.role || 'ADMIN',
            bio: data.user.bio || '',
            avatar: data.user.avatar || '',
            location: data.user.location || '',
            website: data.user.website || '',
            linkedin: data.user.linkedin || '',
            github: data.user.github || '',
          });
        }
      }
    } catch {
      setErrorMsg('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.error || 'Failed to update profile');
      }
    } catch {
      setErrorMsg('Network error updating profile');
    }
  };

  if (loading) return <div style={{ padding: '32px', color: 'var(--text-primary)' }}>Loading profile...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Profile Settings
      </h1>

      {errorMsg && (
        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar Section */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser size={18} /> Avatar & Branding
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-tertiary)' }}>
              {profile.avatar ? <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
            </div>
            <div style={{ flex: 1 }}>
              <input
                name="avatar"
                value={profile.avatar}
                onChange={handleChange}
                placeholder="Image URL (e.g. https://...)"
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', marginBottom: '4px' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Paste image URL or avatar link</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser size={18} /> Personal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
              <input name="name" value={profile.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</label>
              <input name="email" type="email" value={profile.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role</label>
              <input name="role" value={profile.role} disabled style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', resize: 'vertical' }} />
          </div>
        </div>

        {/* Social Links */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Social & Location Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Location / City</label>
              <input name="location" value={profile.location} onChange={handleChange} placeholder="Jakarta, Indonesia" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Website</label>
              <input name="website" value={profile.website} onChange={handleChange} placeholder="https://zaidanzahar.dev" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>GitHub</label>
              <input name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/zaidanzahar" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>LinkedIn</label>
              <input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/zaidanzahar" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '10px 24px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <FiSave size={16} /> Save Changes
          </button>
          {saved && <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Profile saved!</span>}
          <button type="button" onClick={() => signOut()} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-default)', borderRadius: '6px', cursor: 'pointer', color: 'var(--error)', fontSize: '0.875rem' }}>Sign Out</button>
        </div>
      </form>
    </div>
  );
}
