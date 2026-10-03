'use client';

import { useState, useEffect } from 'react';
import { RiMailLine, RiGithubLine, RiLinkedinLine, RiMapPinLine } from 'react-icons/ri';

const defaultInfo = [
  { icon: RiMailLine, label: 'Email', value: 'contact@zaidanghiffari.my.id', href: 'mailto:contact@zaidanghiffari.my.id' },
  { icon: RiGithubLine, label: 'GitHub', value: 'github.com/Zydos', href: 'https://github.com/Zydos' },
  { icon: RiLinkedinLine, label: 'LinkedIn', value: 'linkedin.com/in/zaidan-ghiffari', href: 'https://linkedin.com/in/zaidan-ghiffari' },
  { icon: RiMapPinLine, label: 'Location', value: 'Bandung, Indonesia', href: null },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [contactList, setContactList] = useState(defaultInfo);
  const [intro, setIntro] = useState('Whether you have a question about QA, web dev, or project management, feel free to drop a message.');

  useEffect(() => {
    fetch('/api/profile')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.profile) {
          const p = data.profile;
          setContactList([
            { icon: RiMailLine, label: 'Email', value: p.email || defaultInfo[0].value, href: p.email ? `mailto:${p.email}` : defaultInfo[0].href },
            { icon: RiGithubLine, label: 'GitHub', value: p.github ? p.github.replace(/^https?:\/\//, '') : defaultInfo[1].value, href: p.github || defaultInfo[1].href },
            { icon: RiLinkedinLine, label: 'LinkedIn', value: p.linkedin ? p.linkedin.replace(/^https?:\/\//, '') : defaultInfo[2].value, href: p.linkedin || defaultInfo[2].href },
            { icon: RiMapPinLine, label: 'Location', value: p.location || defaultInfo[3].value, href: null },
          ]);
        }
      })
      .catch(() => {});

    fetch('/api/details')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.details?.contact_intro) setIntro(data.details.contact_intro);
      })
      .catch(() => {});
  }, []);

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
      if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }); }
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
            <div>
              <label>Name</label>
              <input type="text" placeholder="Your name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Subject</label>
              <input type="text" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required />
            </div>
            <div>
              <label>Message</label>
              <textarea rows="4" placeholder="Your message..." value={formData.message} onChange={handleChange} required />
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
