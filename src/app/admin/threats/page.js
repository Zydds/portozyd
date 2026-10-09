'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/components/admin/ConfirmProvider';

// Attack kind derived server-side in GET /api/admin/probes (read-time
// classification; enforcement is a uniform 302 regardless of kind).
const KIND_META = {
  CSRF: { label: 'CSRF', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.4)' },
  EXPLOIT: { label: 'EXPLOIT', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.4)' },
  SCANNER: { label: 'SCANNER', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.4)' },
  BOT: { label: 'BOT', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.4)' },
  'NO-UA': { label: 'NO-UA', color: '#a3a3a3', bg: 'rgba(163, 163, 163, 0.1)', border: 'rgba(163, 163, 163, 0.4)' },
  HUMAN: { label: 'HUMAN', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.4)' },
};

export default function ThreatsPage() {
  const confirmDialog = useConfirm();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProbes = useCallback(async (targetPage) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/probes?page=${targetPage}&limit=15`);
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (data.items.length === 0 && data.page > 1) setPage(data.page - 1);
      } else {
        setError('Failed to load probes');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProbes(page);
  }, [page, fetchProbes]);

  const deleteProbe = async (id) => {
    if (!(await confirmDialog('Delete this probe log entry?', { danger: true, confirmText: 'Delete' }))) return;
    await fetch('/api/admin/probes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (items.length === 1 && page > 1) setPage(page - 1);
    else fetchProbes(page);
  };

  const clearAll = async () => {
    if (!(await confirmDialog('Clear ALL probe logs? This cannot be undone.', { danger: true, confirmText: 'Clear All' }))) return;
    await fetch('/api/admin/probes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    setPage(1);
    fetchProbes(1);
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-secondary)' }}>Loading probes...</div>;
  if (error) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--error)' }}>{error}</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)', margin: 0 }}>Threat Board</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{total} denied probe{total !== 1 ? 's' : ''} recorded at the admin gate.</p>
        </div>
        {total > 0 && (
          <button onClick={clearAll} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.6 }}>🛡️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No Probes Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Denied requests to the admin surface will show up here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((probe) => {
            const meta = KIND_META[probe.kind] || KIND_META.HUMAN;
            return (
              <div key={probe.id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, padding: '3px 8px', borderRadius: '4px' }}>
                      {meta.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{probe.ip}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                      {probe.method} {probe.path}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {new Date(probe.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {probe.userAgent && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-tertiary)', margin: '0 0 8px', wordBreak: 'break-all', lineHeight: 1.5 }}>
                    {probe.userAgent}
                  </p>
                )}
                <button
                  onClick={() => deleteProbe(probe.id)}
                  style={{ fontSize: '0.75rem', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Delete
                </button>
              </div>
            );
          })}

          {totalPages > 1 && (
            <nav aria-label="Probe pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px 16px', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{ padding: '6px 12px', fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
              >
                ← Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{ padding: '6px 12px', fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: page >= totalPages ? 'default' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
