'use client';

import { useState } from 'react';
import { RiMailLine, RiGithubLine, RiLinkedinLine, RiMapPinLine } from 'react-icons/ri';

const defaultInfo = [
  { icon: RiMailLine, label: 'Email', value: 'contact@zaidanghiffari.my.id', href: 'mailto:contact@zaidanghiffari.my.id' },
  { icon: RiGithubLine, label: 'GitHub', value: 'github.com/Zydos', href: 'https://github.com/Zydos' },
  { icon: RiLinkedinLine, label: 'LinkedIn', value: 'linkedin.com/in/zaidan-ghiffari', href: 'https://linkedin.com/in/zaidan-ghiffari' },
  { icon: RiMapPinLine, label: 'Location', value: 'Bandung, Indonesia', href: null },
];

const defaultIntro = 'Whether you have a question about QA, web dev, or project management, feel free to drop a message.';

export default function ContactSection({ profile = {}, details = {} }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const intro = details.contact_intro || defaultIntro;
  const contactList = [
    { icon: RiMailLine, label: 'Email', value: profile.email || defaultInfo[0].value, href: profile.email ? `mailto:${profile.email}` : defaultInfo[0].href },
    { icon: RiGithubLine, label: 'GitHub', value: profile.github ? profile.github.replace(/^https?:\/\//, '') : defaultInfo[1].value, href: profile.github || defaultInfo[1].href },
    { icon: RiLinkedinLine, label: 'LinkedIn', value: profile.linkedin ? profile.linkedin.replace(/^https?:\/\//, '') : defaultInfo[2].value, href: profile.linkedin || defaultInfo[2].href },
    { icon: RiMapPinLine, label: 'Location', value: profile.location || defaultInfo[3].value, href: null },
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', subject: '', message: '', website: '' }); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
    finally { setSending(false); }
  };

  return (
    <section id="contact" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>Get in touch</h2>
          </div>
          <span className="meta">form open</span>
        </div>

        <div className="contact-grid">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 20px' }}>{intro}</p>
            <ul className="clist">
              {contactList.map((item, i) => (
                <li key={i}>
                  <span className="lbl">{item.label}</span>
                  {item.href ? <a href={item.href} style={{ color: 'var(--text-secondary)' }}>{item.value}</a> : <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input id="subject" type="text" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" placeholder="Your message..." value={formData.message} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'}</button>
            {status === 'success' && <p style={{ color: 'var(--accent-dim)', fontSize: '0.85rem', marginTop: '12px' }}>Message sent!</p>}
            {status === 'error' && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '12px' }}>Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
