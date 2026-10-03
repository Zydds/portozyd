'use client';

import { useState, useEffect } from 'react';

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/inbox');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setError('Failed to load messages');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id, isRead) => {
    await fetch('/api/admin/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: !isRead }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/admin/inbox', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading messages...</div>;
  }

  if (error) {
    return <div style={{ padding: '32px', color: 'var(--error)' }}>{error}</div>;
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{msg.email}</p>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
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
        </div>
      )}
    </div>
  );
}
