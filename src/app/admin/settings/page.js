'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiShield, FiDatabase, FiCheckCircle } from 'react-icons/fi';

export default function SettingsPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: data.message || 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network connection failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', width: '100%' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px' }}>
        Settings &amp; Security
      </h1>

      {msg.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '24px',
          background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
          border: `1px solid ${msg.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
          fontSize: '0.875rem',
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Security / Password */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiLock size={18} /> Admin Password
          </h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '450px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Password</label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>New Password</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                alignSelf: 'flex-start',
                marginTop: '8px',
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Database & Environment Info */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiDatabase size={18} /> System Status
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Database</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCheckCircle size={14} /> Neon PostgreSQL Connected
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Authentication</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                NextAuth v5 (Credentials JWT)
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Framework</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                Next.js 16 (App Router + Turbopack)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
