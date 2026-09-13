'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiArrowDownSLine } from 'react-icons/ri';
import ThemeToggle from '@/components/ThemeToggle';

const portfolioLinks = [
  { label: 'All Projects', href: '#portfolio' },
  { label: 'Web Development', href: '#portfolio-web' },
  { label: 'QA Testing', href: '#portfolio-qa' },
];

const hobbiesLinks = [
  { label: 'Quality Assurance', href: '/qa' },
  { label: 'Web Development', href: '/webdev' },
  { label: 'Project Management', href: '/pm' },
  { label: 'Gaming', href: '/gaming' },
  { label: 'Others', href: '/others' },
];

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 0',
          fontFamily: 'inherit',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        {label}
        <RiArrowDownSLine
          size={16}
          style={{
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="dropdown-enter"
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '-16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '200px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 100,
          }}
        >
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navLinkStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
      background: 'rgba(10,10,10,0.8)',
      borderBottom: '1px solid var(--border-subtle)',
      height: '64px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          href="/"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          ZGA
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href={isHome ? '#home' : '/'} style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Home
          </Link>
          <Link href={isHome ? '#about' : '/#about'} style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            About
          </Link>
          <Link href={isHome ? '#skills' : '/#skills'} style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Skills
          </Link>
          <Dropdown label="Portfolio" items={portfolioLinks} />
          <Dropdown label="Hobbies" items={hobbiesLinks} />
          <Link href={isHome ? '#contact' : '/#contact'} style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Contact
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
