'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RiDashboardLine, RiFolder2Line, RiUserLine, 
  RiBriefcaseLine, RiToolsLine, RiPriceTag3Line, 
  RiImageLine, RiInboxLine, RiSettings4Line, RiArrowLeftLine 
} from 'react-icons/ri';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: RiDashboardLine },
  { label: 'Projects', href: '/admin/projects', icon: RiFolder2Line },
  { label: 'Profile', href: '/admin/profile', icon: RiUserLine },
  { label: 'Experience', href: '/admin/experience', icon: RiBriefcaseLine },
  { label: 'Skills', href: '/admin/skills', icon: RiToolsLine },
  { label: 'Topics', href: '/admin/topics', icon: RiPriceTag3Line },
  { label: 'Media', href: '/admin/media', icon: RiImageLine },
  { label: 'Inbox', href: '/admin/inbox', icon: RiInboxLine },
  { label: 'Settings', href: '/admin/settings', icon: RiSettings4Line },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          ZGA Admin
        </h2>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (pathname.startsWith(href) && href !== '/admin');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-ghost)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
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
        <Link href="/" style={{
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
