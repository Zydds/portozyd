'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiImage, FiVideo } from 'react-icons/fi';

export function ImagePicker({ open, value, onSelect, onClose, label = 'Choose an image' }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/media');
      if (res.status === 401) { setError('Session expired — please log in again.'); return; }
      if (res.ok) {
        const data = await res.json();
        // Uploads first; stable sort keeps newest-first order within each group.
        const list = (data.media || []).slice().sort((a, b) => {
          const rank = (m) => (m.source === 'upload' ? 0 : 1);
          return rank(a) - rank(b);
        });
        setMedia(list);
      } else {
        setError('Failed to load library');
      }
    } catch {
      setError('Failed to load library');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) fetchMedia(); }, [open, fetchMedia]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="confirm-backdrop" onClick={onClose} role="presentation">
      <div
        className="confirm-dialog picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Choose an image"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="picker-header">
          <h3 className="confirm-title" style={{ margin: 0 }}>{label}</h3>
          <button type="button" className="picker-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {loading ? (
          <p className="picker-note">Loading library…</p>
        ) : error ? (
          <p className="picker-note">{error}</p>
        ) : media.length === 0 ? (
          <p className="picker-note">No media yet — upload one in the Media Library first.</p>
        ) : (
          <div className="picker-grid">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`picker-card${value === item.url ? ' selected' : ''}`}
                onClick={() => onSelect(item.url)}
                title={item.filename}
              >
                {item.mimeType?.startsWith('video/') ? (
                  <span className="picker-thumb-fallback"><FiVideo size={22} /></span>
                ) : (
                  <>
                    <span className="picker-thumb-fallback"><FiImage size={22} /></span>
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      sizes="160px"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </>
                )}
                <span className={`picker-badge${item.source === 'upload' ? ' upload' : ''}`}>
                  {item.source === 'upload' ? 'Uploaded' : 'External'}
                </span>
                <span className="picker-name">{item.filename}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Shared field. Default: "Choose image" + secondary external-URL escape hatch.
// saveMode (profile avatar): once a value is chosen the primary button becomes
// "Save" (+ saved indicator beside "Cancel") instead of reopening the picker.
export function MediaField({ value, onChange, placeholder, saveMode = false, onSave, onCancel, saving = false, saved = false, label = 'Choose image' }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const showInput = manual || Boolean(value);
  const chosen = saveMode && Boolean(value);

  return (
    <div>
      {showInput && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
        />
      )}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: showInput ? '8px' : 0 }}>
        {chosen ? (
          <>
            <button type="button" className="picker-choose" onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            {saved && <span className="picker-saved">✓ Profile image saved</span>}
            <button type="button" className="picker-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="picker-choose" onClick={() => setPickerOpen(true)}>
              <FiImage size={14} /> {label}
            </button>
            {!showInput && (
              <button type="button" className="picker-secondary" onClick={() => setManual(true)}>
                Use external URL
              </button>
            )}
            {value && !saveMode && (
              <button type="button" className="picker-secondary" onClick={() => onChange('')}>
                Clear
              </button>
            )}
          </>
        )}
      </div>
      {!chosen && (
        <ImagePicker
          open={pickerOpen}
          value={value}
          label={label}
          onSelect={(url) => { onChange(url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
