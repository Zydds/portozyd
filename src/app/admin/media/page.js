'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiUpload, FiUploadCloud, FiTrash2, FiCopy, FiCheck, FiExternalLink, FiImage, FiLink, FiVideo } from 'react-icons/fi';
import { useConfirm } from '@/components/admin/ConfirmProvider';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function MediaPage() {
  const confirmDialog = useConfirm();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ filename: '', url: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [message, setMessage] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) { const data = await res.json(); setMedia(data.media || []); }
    } catch { setMessage('Failed to load media assets'); }
    finally { setLoading(false); }
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const clearPendingFile = () => {
    setPendingFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    setMessage('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage('Unsupported file type. Use JPEG, PNG, WebP, or MP4.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage('File exceeds the 5MB limit');
      return;
    }
    if (pendingFile) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleUpload = () => {
    if (!pendingFile || uploading) return;
    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/media');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        clearPendingFile();
        fetchMedia();
      } else {
        let msg = 'Upload failed';
        try { msg = JSON.parse(xhr.responseText).error || msg; } catch { /* keep default */ }
        setMessage(msg);
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setProgress(0);
      setMessage('Network error');
    };

    const fd = new FormData();
    fd.append('file', pendingFile.file);
    xhr.send(fd);
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: formData.filename, url: formData.url.trim() }),
      });
      if (res.ok) { setFormData({ filename: '', url: '' }); setShowAddForm(false); fetchMedia(); }
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Failed to add media'); }
    } catch { setMessage('Network error'); }
  };

  const handleDelete = async (item) => {
    const usedBy = item.usedBy || [];
    const prompt = usedBy.length > 0
      ? `"${item.filename}" is still used in ${usedBy.map((u) => u.title).join(', ')}. Delete anyway?`
      : 'Delete this media asset?';
    if (!(await confirmDialog(prompt, { danger: true, confirmText: 'Delete' }))) return;
    try {
      const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) });
      if (res.ok) fetchMedia();
      else { const err = await res.json().catch(() => ({})); setMessage(err.error || 'Failed to delete media'); }
    } catch { setMessage('Error deleting media'); }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div style={{ padding: 'clamp(16px, 4vw, 32px)', color: 'var(--text-primary)' }}>Loading media library...</div>;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '1100px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '1.875rem', color: 'var(--text-primary)' }}>Media Library</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Upload images or videos or paste links — then reuse them across your site.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', background: showAddForm ? 'transparent' : 'var(--accent)', color: showAddForm ? 'var(--text-primary)' : '#fff', border: showAddForm ? '1px solid var(--border)' : 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif' }}>
          <FiLink size={16} /> {showAddForm ? 'Close' : 'Add Image URL'}
        </button>
      </div>

      {message && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--text-tertiary)' }}>{message}</div>}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {pendingFile ? (
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {pendingFile.file.type.startsWith('video/') ? (
              <video src={pendingFile.previewUrl} muted playsInline preload="metadata" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)', background: '#000' }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pendingFile.previewUrl} alt="Upload preview" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pendingFile.file.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{formatSize(pendingFile.file.size)} · compressed on upload</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpload} disabled={uploading} style={{ padding: '10px 22px', background: uploading ? 'var(--text-tertiary)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: uploading ? 'default' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUpload size={16} /> {uploading ? `Uploading ${progress}%` : 'Upload'}
              </button>
              <button onClick={clearPendingFile} disabled={uploading} style={{ padding: '10px 20px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '6px', cursor: uploading ? 'default' : 'pointer', fontWeight: 500, opacity: uploading ? 0.5 : 1 }}>Cancel</button>
            </div>
          </div>
          {uploading && (
            <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden', marginTop: '14px' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 0.2s' }} />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          style={{
            marginBottom: '32px',
            padding: '28px',
            border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
            background: dragOver ? 'var(--bg-raised)' : 'transparent',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          <FiUploadCloud size={28} style={{ color: dragOver ? 'var(--accent)' : 'var(--text-tertiary)' }} />
          <span style={{ fontSize: '0.9375rem' }}>Drag &amp; drop an image or video here, or <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>browse</span></span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>JPEG, PNG, WebP, or MP4 · max 5MB · compressed automatically</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddMedia} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>Register Direct Image Asset</h3>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Label / Filename</label><input required placeholder="e.g. Hero Preview" value={formData.filename} onChange={e => setFormData({ ...formData, filename: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} /></div>
          <div><label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Direct Image URL</label><input required placeholder="Paste direct image link ending in .jpg/.png" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text-primary)' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>💡 Right-click any photo and select &quot;Copy image address&quot;.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Asset</button>
            <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {media.length === 0 ? (
        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>No media assets saved yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Upload an image or video or paste a direct link to start your library.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '20px' }}>
          {media.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {item.mimeType?.startsWith('video/') ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-tertiary)', width: '100%', height: '100%' }}><FiVideo size={24} /><span style={{ fontSize: '0.75rem' }}>Video</span></div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    sizes="(max-width: 900px) 100vw, 240px"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                  />
                )}
                <span style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.03em', padding: '3px 8px', borderRadius: '999px', background: item.source === 'upload' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: item.source === 'upload' ? 'rgb(52, 211, 153)' : 'var(--text-secondary)' }}>
                  {item.source === 'upload' ? 'Uploaded' : 'External'}
                </span>
                <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-tertiary)' }}><FiImage size={24} /><span style={{ fontSize: '0.75rem' }}>Image Link</span></div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.filename}>{item.filename}</h4>
                {item.usedBy?.length > 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.usedBy.map((u) => u.title).join(', ')}>
                    Used in: {item.usedBy.map((u) => u.title).join(', ')}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                  <button onClick={() => copyToClipboard(item.url, item.id)} style={{ flex: 1, padding: '6px 10px', background: copiedId === item.id ? 'var(--accent)' : 'var(--bg)', color: copiedId === item.id ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>{copiedId === item.id ? <FiCheck size={12} /> : <FiCopy size={12} />} {copiedId === item.id ? 'Copied' : 'Copy URL'}</button>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="Open URL"><FiExternalLink size={12} /></a>
                  <button onClick={() => handleDelete(item)} style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--text-tertiary)', borderRadius: '4px', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete"><FiTrash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
