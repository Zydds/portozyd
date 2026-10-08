'use client';

import Link from 'next/link';
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

export default function AdminSidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname();

  return (
    <aside id="admin-sidebar" className={`admin-sidebar${open ? ' open' : ''}`} style={{
      width: '260px',
      backgroundColor: 'var(--bg-raised, #131316)',
      borderRight: '1px solid var(--border-strong, #33333a)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-strong, #33333a)' }}>
        <h2 style={{ fontFamily: 'var(--font-spectral, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          ZYD Admin
        </h2>
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
