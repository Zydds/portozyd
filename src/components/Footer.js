'use client';

import Link from 'next/link';
import { RiGithubLine, RiLinkedinLine, RiMailLine, RiFacebookLine, RiInstagramLine, RiTwitterXLine, RiTelegramLine, RiDiscordLine } from 'react-icons/ri';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

const exploreLinks = [
  { label: 'Quality Assurance', href: '/qa' },
  { label: 'Web Development', href: '/webdev' },
  { label: 'Project Management', href: '/pm' },
  { label: 'Gaming', href: '/gaming' },
  { label: 'Others', href: '/others' },
];

const linkStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontFamily: 'var(--font-inter), sans-serif',
  transition: 'color 0.15s ease',
};

export default function Footer({ profile = {}, details = {} }) {
  const footerQuote = details.footer_quote ||
    'Building reliable software and quality-driven web experiences. Always learning, always improving.';
  const footerBrand = details.footer_brand || 'ZYD';
  const withProtocol = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
  const detailsSocials = [
    { icon: RiFacebookLine, url: details.social_facebook_url, label: 'Facebook' },
    { icon: RiInstagramLine, url: details.social_instagram_url, label: 'Instagram' },
    { icon: RiTwitterXLine, url: details.social_x_url, label: 'X' },
    { icon: RiTelegramLine, url: details.social_telegram_url, label: 'Telegram' },
    { icon: RiDiscordLine, url: details.social_discord_url, label: 'Discord' },
  ].filter((s) => s.url);
  const socialLinks = [
    { icon: RiGithubLine, href: profile.github || 'https://github.com/Zydos', label: 'GitHub' },
    { icon: RiLinkedinLine, href: profile.linkedin || 'https://linkedin.com/in/zaidan-ghiffari', label: 'LinkedIn' },
    { icon: RiMailLine, href: profile.email ? `mailto:${profile.email}` : 'mailto:contact@zaidanghiffari.my.id', label: 'Email' },
    ...detailsSocials.map((s) => ({ icon: s.icon, href: withProtocol(s.url), label: s.label })),
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-raised)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div className="wrap" style={{ padding: '48px clamp(20px, 5vw, 56px) 32px' }}>
        {/* Footer Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px' }}>
            <Link href="/" style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: 'var(--font-spectral)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}>
              {footerBrand}
            </Link>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {footerQuote}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent-dim)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textTransform: 'lowercase',
              marginBottom: '14px',
              letterSpacing: '0.05em',
            }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore / Topic Pages */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textTransform: 'lowercase',
              marginBottom: '14px',
              letterSpacing: '0.05em',
            }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exploreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={linkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-tertiary)',
        }}>
          <span>© 2026 Zaidan Ghiffari Azhar. All rights reserved.</span>
          <span>Built with Next.js &amp; Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
