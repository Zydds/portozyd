'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  RiDashboardLine, RiFolder2Line, RiUserLine, 
  RiBriefcaseLine, RiToolsLine, RiPriceTag3Line, 
  RiImageLine, RiInboxLine, RiSettings4Line, RiArrowLeftLine,
  RiFileTextLine, RiShieldLine
} from 'react-icons/ri';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: RiDashboardLine },
  { label: 'Projects', href: '/admin/projects', icon: RiFolder2Line },
  { label: 'Profile', href: '/admin/profile', icon: RiUserLine },
  { label: 'Experience', href: '/admin/experience', icon: RiBriefcaseLine },
  { label: 'Skills', href: '/admin/skills', icon: RiToolsLine },
  { label: 'Details', href: '/admin/details', icon: RiFileTextLine },
  { label: 'Topics', href: '/admin/topics', icon: RiPriceTag3Line },
  { label: 'Media', href: '/admin/media', icon: RiImageLine },
  { label: 'Inbox', href: '/admin/inbox', icon: RiInboxLine },
  { label: 'Threats', href: '/admin/threats', icon: RiShieldLine },
  { label: 'Settings', href: '/admin/settings', icon: RiSettings4Line },
];

export default function AdminSidebar({ open = false, onClose = () => {}, collapsed = false, onCollapse = () => {} }) {
  const pathname = usePathname();
  const [account, setAccount] = useState({ avatar: null, email: null });
  const [avatarError, setAvatarError] = useState(false);

  // Refetch on navigation and whenever the profile page reports a save, so
  // an avatar/email change shows up without a full reload.
  const fetchAccount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAccount({ avatar: data.user.avatar || null, email: data.user.email || null });
          setAvatarError(false);
        }
      }
    } catch { /* sidebar keeps whatever it had */ }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAccount(); }, [pathname, fetchAccount]);

  useEffect(() => {
    const onUpdate = () => fetchAccount();
    window.addEventListener('profile-updated', onUpdate);
    return () => window.removeEventListener('profile-updated', onUpdate);
  }, [fetchAccount]);

  return (
    <aside id="admin-sidebar" className={`admin-sidebar${open ? ' open' : ''}${collapsed ? ' collapsed' : ''}`} style={{
      width: '260px',
      backgroundColor: 'var(--bg-raised, #131316)',
      borderRight: '1px solid var(--border-strong, #33333a)',
    }}>
      <div style={{ position: 'relative', padding: '20px 16px 16px', borderBottom: '1px solid var(--border-strong, #33333a)', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
            ZYD Admin
          </h2>
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Hide sidebar"
            title="Hide sidebar"
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px', padding: 0,
              background: 'transparent', border: '1px solid var(--border, #232327)',
              borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'pointer',
            }}
          >
            <RiArrowLeftLine size={16} />
          </button>
        </div>
        {account.email && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
            {account.avatar && !avatarError ? (
              <Image
                key={account.avatar}
                src={account.avatar}
                alt=""
                width={36}
                height={36}
                onError={() => setAvatarError(true)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border, #232327)', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg, #0B0B0D)', border: '1px solid var(--border, #232327)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                👤
              </div>
            )}
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)' }}>logged in as</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={account.email}>
                {account.email}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (pathname.startsWith(href) && href !== '/admin');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent, #3A4CFF)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg, #0B0B0D)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
        <Link href="/" onClick={onClose} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        >
          <RiArrowLeftLine size={18} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
