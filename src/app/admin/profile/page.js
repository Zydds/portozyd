'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FiUser, FiSave, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({ name: '', email: '', role: 'ADMIN', bio: '', avatar: '', location: '', website: '', linkedin: '', github: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const didLoadRef = useRef(false);

  useEffect(() => {
    // Session refocus/revalidation re-runs this effect; without the guard the
    // refetch would overwrite any edits the admin has typed in the meantime.
    if (didLoadRef.current) return;
    let cancelled = false;
    (async () => {
      // Load the persisted profile — the session only carries id/name/email,
      // so hardcoding '' here used to wipe every other field on save.
      try {
        const res = await fetch('/api/admin/profile');
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          if (u && !cancelled) {
            didLoadRef.current = true;
            setProfile({
              name: u.name || '',
              email: u.email || '',
              role: u.role || 'ADMIN',
              bio: u.bio || '',
              avatar: u.avatar || '',
              location: u.location || '',
              website: u.website || '',
              linkedin: u.linkedin || '',
              github: u.github || '',
            });
            setLoading(false);
            return;
          }
        }
      } catch { /* fall through to session fallback */ }
      if (cancelled) return;
      didLoadRef.current = true;
      if (session?.user) {
        setProfile(prev => ({ ...prev, name: session.user.name || '', email: session.user.email || '', role: session.user.role || 'ADMIN' }));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'avatar') setAvatarError(false);
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else { const err = await res.json().catch(() => ({})); setErrorMsg(err.error || 'Failed to update profile'); }
    } catch { setErrorMsg('Network error updating profile'); }
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading profile...</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '32px' }}>Profile Settings</h1>

      {errorMsg && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)' }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> Avatar & Branding
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
              {profile.avatar && !avatarError ? (
                <Image
                  key={profile.avatar}
                  src={profile.avatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  onError={() => setAvatarError(true)}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : '👤'}
            </div>
            <div style={{ flex: 1 }}>
              <input name="avatar" value={profile.avatar} onChange={handleChange} placeholder="Image URL" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', marginBottom: '4px' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Paste image URL</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> Personal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label><input name="name" value={profile.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</label><input name="email" type="email" value={profile.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role</label><input name="role" value={profile.role} disabled style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-tertiary)' }} /></div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>Social Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Location / City</label><input name="location" value={profile.location} onChange={handleChange} placeholder="Bandung, Indonesia" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Website</label><input name="website" value={profile.website} onChange={handleChange} placeholder="https://zaidanzahar.dev" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>GitHub</label><input name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/Zydos" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>LinkedIn</label><input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/zaidan-ghiffari" style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><FiSave size={16} /> Save Changes</button>
          {saved && <span style={{ color: 'var(--accent-dim)', fontSize: '0.85rem' }}>Saved!</span>}
          <button type="button" onClick={() => signOut()} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Sign Out</button>
        </div>
      </form>
    </div>
  );
}