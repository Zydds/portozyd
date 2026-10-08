'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiArrowDownSLine, RiSunLine, RiMoonLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { useTheme } from '@/components/ThemeProvider';

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
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          fontFamily: 'var(--font-spectral)',
          fontStyle: 'italic',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        {label}
        <RiArrowDownSLine
          size={15}
          style={{
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.75,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '190px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-strong)',
            borderRadius: '6px',
            padding: '6px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            zIndex: 100,
          }}
        >
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-spectral)',
                fontStyle: 'italic',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(58, 76, 255, 0.12)';
                e.currentTarget.style.color = 'var(--text-primary)';
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
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);

  const setMenu = (open) => {
    menuOpenRef.current = open;
    setMenuOpen(open);
  };

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setMenu(false);
    }
    function onResize() {
      if (window.innerWidth > 820) setMenu(false);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    // Close the mobile panel after any navigation (back/forward included;
    // normal link clicks also close via onClick).
    if (menuOpenRef.current) {
      setMenu(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onClickOutside(e) {
      if (e.target instanceof Element && e.target.closest('.site-nav')) return;
      setMenu(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  const closeMenu = () => setMenu(false);

  const linkStyle = {
    fontFamily: 'var(--font-spectral)',
    fontStyle: 'italic',
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 0',
    transition: 'color 0.15s ease',
  };

  const mainLinks = [
    { label: 'Home', href: isHome ? '#home' : '/' },
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Skills', href: isHome ? '#skills' : '/#skills' },
    { label: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <nav className="site-nav">
      <Link href="/" className="logo" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }} onClick={closeMenu}>
        ZYD
      </Link>
      <ul className="navlinks">
        <li>
          <Link
            href={isHome ? '#home' : '/'}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href={isHome ? '#about' : '/#about'}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href={isHome ? '#skills' : '/#skills'}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Skills
          </Link>
        </li>
        <li><Dropdown label="Portfolio" items={portfolioLinks} /></li>
        <li><Dropdown label="Hobbies" items={hobbiesLinks} /></li>
        <li>
          <Link
            href={isHome ? '#contact' : '/#contact'}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Contact
          </Link>
        </li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="theme-toggle"
          type="button"
        >
          {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
        </button>
        <button
          onClick={() => setMenu(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="menu-toggle"
          type="button"
        >
          {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="mobile-nav">
          {mainLinks.map(item => (
            <Link key={item.label} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <div className="mnav-group">
            <div className="mnav-label">portfolio</div>
            {portfolioLinks.map(item => (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mnav-group">
            <div className="mnav-label">hobbies</div>
            {hobbiesLinks.map(item => (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
