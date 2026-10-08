'use client';

import { useState, useEffect } from 'react';
import { RiMenuLine } from 'react-icons/ri';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <div className="admin-mobilebar">
          <button
            type="button"
            className="admin-menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            onClick={() => setOpen((o) => !o)}
          >
            <RiMenuLine size={22} />
          </button>
          <span style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 600 }}>
            ZYD Admin
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
