'use client';

import { useState, useEffect } from 'react';
import { FiLock, FiShield, FiDatabase, FiCheckCircle } from 'react-icons/fi';

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (passwords.newPassword !== passwords.confirmPassword) { setMsg({ type: 'error', text: 'New passwords do not match' }); return; }
    if (passwords.newPassword.length < 6) { setMsg({ type: 'error', text: 'New password must be at least 6 characters' }); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change-password', currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      if (res.status === 401) { return; }
      const data = await res.json();
      if (res.ok) { setMsg({ type: 'success', text: data.message || 'Password changed successfully!' }); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
      else { setMsg({ type: 'error', text: data.error || 'Failed to update password' }); }
    } catch { setMsg({ type: 'error', text: 'Network connection failed' }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '32px' }}>Settings &amp; Security</h1>

      {msg.text && (
        <div style={{ padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', background: msg.type === 'success' ? 'rgba(58, 76, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? 'var(--accent-dim)' : 'var(--text-tertiary)', border: `1px solid ${msg.type === 'success' ? 'var(--accent)' : 'var(--border-strong)'}`, fontSize: '0.85rem' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> Admin Password
          </h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '450px' }}>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Password</label><input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>New Password</label><input type="password" required value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Confirm New Password</label><input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 500, alignSelf: 'flex-start', marginTop: '8px' }}>{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="icon-chip"></span> System Status
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Database</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheckCircle size={14} /> Neon PostgreSQL Connected</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Authentication</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>NextAuth v5 (Credentials JWT)</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Framework</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>Next.js 16 (App Router + Turbopack)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}