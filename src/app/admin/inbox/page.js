'use client';

import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 10;

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async (targetPage) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inbox?page=${targetPage}&limit=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setUnread(data.unread);
        if (data.items.length === 0 && data.page > 1) {
          setPage(data.page - 1);
        }
      } else {
        setError('Failed to load messages');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = async (id, isRead) => {
    await fetch('/api/admin/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: !isRead }),
    });
    fetchMessages(page);
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/admin/inbox', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (messages.length === 1 && page > 1) {
      // Deleted the last item on this page — go back one (effect refetches).
      setPage(page - 1);
    } else {
      fetchMessages(page);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages(page);
  }, [page, fetchMessages]);

  if (loading) {
    return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-secondary)' }}>Loading messages...</div>;
  }

  if (error) {
    return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--error)' }}>{error}</div>;
  }

  const unreadCount = unread;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Inbox
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {unreadCount} unread {unreadCount !== 1 ? 'messages' : 'message'}
        </div>
      </div>

      {messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.6 }}>📭</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No Messages Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>New messages from visitors will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                backgroundColor: msg.read ? 'var(--bg-secondary)' : 'rgba(99, 102, 241, 0.05)',
                border: `1px solid ${msg.read ? 'var(--border-subtle)' : 'var(--accent-primary)'}`,
                borderRadius: '8px',
                padding: '20px',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!msg.read) e.currentTarget.style.borderColor = 'var(--accent-hover)';
              }}
              onMouseLeave={e => {
                if (!msg.read) e.currentTarget.style.borderColor = 'var(--accent-primary)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{msg.email}</p>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  {new Date(msg.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <h4 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>{msg.subject}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{msg.message}</p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => markRead(msg.id, msg.read)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: msg.read ? 'var(--text-tertiary)' : 'var(--accent-primary)',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {msg.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--error)',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <nav aria-label="Inbox pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px 16px', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  cursor: page <= 1 ? 'default' : 'pointer',
                  opacity: page <= 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>
              <span>Page {page} of {totalPages} · {total} messages</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  cursor: page >= totalPages ? 'default' : 'pointer',
                  opacity: page >= totalPages ? 0.5 : 1,
                }}
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
