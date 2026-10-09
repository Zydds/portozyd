'use client';

import { useState, useEffect } from 'react';
import { RiMenuLine, RiArrowRightLine } from 'react-icons/ri';
import AdminSidebar from './AdminSidebar';
import { ConfirmProvider } from './ConfirmProvider';

const COLLAPSE_KEY = 'admin_sidebar_collapsed';

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      // localStorage only exists client-side; read after hydration to avoid SSR mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(COLLAPSE_KEY) === '1') setCollapsed(true);
    } catch { /* storage unavailable */ }
  }, []);

  const setSidebarCollapsed = (value) => {
    setCollapsed(value);
    try {
      localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
    } catch { /* storage unavailable */ }
  };

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
    <ConfirmProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <AdminSidebar
          open={open}
          onClose={() => setOpen(false)}
          collapsed={collapsed}
          onCollapse={() => setSidebarCollapsed(true)}
        />
        {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}
        {collapsed && (
          <button
            type="button"
            className="admin-reveal"
            aria-label="Show sidebar"
            title="Show sidebar"
            onClick={() => setSidebarCollapsed(false)}
          >
            <RiArrowRightLine size={20} />
          </button>
        )}
        <main className={`admin-main${collapsed ? ' is-collapsed' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
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
    </ConfirmProvider>
  );
}
