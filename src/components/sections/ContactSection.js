'use client';

import { useState, useEffect } from 'react';
import { RiMailLine, RiGithubLine, RiLinkedinLine, RiMapPinLine } from 'react-icons/ri';

const defaultInfo = [
  {
    icon: RiMailLine,
    label: 'Email',
    value: 'contact@zaidanghiffari.my.id',
    href: 'mailto:contact@zaidanghiffari.my.id',
    key: 'email',
  },
  {
    icon: RiGithubLine,
    label: 'GitHub',
    value: 'github.com/zaidanazhar',
    href: 'https://github.com/zaidanazhar',
    key: 'github',
  },
  {
    icon: RiLinkedinLine,
    label: 'LinkedIn',
    value: 'linkedin.com/in/zaidanazhar',
    href: 'https://linkedin.com/in/zaidanazhar',
    key: 'linkedin',
  },
  {
    icon: RiMapPinLine,
    label: 'Location',
    value: 'Jakarta, Indonesia',
    href: null,
    key: 'location',
  },
];

const inputStyle = {
  width: '100%',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: '10px 12px',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'all 0.15s ease',
};

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [contactList, setContactList] = useState(defaultInfo);
  const [contactIntro, setContactIntro] = useState("Whether you have a question about QA testing, web development projects, or project management methodologies, feel free to drop a message.");

  useEffect(() => {
    // Fetch profile
    fetch('/api/profile')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.profile) {
          const p = data.profile;
          setContactList([
            {
              icon: RiMailLine,
              label: 'Email',
              value: p.email || defaultInfo[0].value,
              href: p.email ? `mailto:${p.email}` : defaultInfo[0].href,
            },
            {
              icon: RiGithubLine,
              label: 'GitHub',
              value: p.github ? p.github.replace(/^https?:\/\//, '') : defaultInfo[1].value,
              href: p.github || defaultInfo[1].href,
            },
            {
              icon: RiLinkedinLine,
              label: 'LinkedIn',
              value: p.linkedin ? p.linkedin.replace(/^https?:\/\//, '') : defaultInfo[2].value,
              href: p.linkedin || defaultInfo[2].href,
            },
            {
              icon: RiMapPinLine,
              label: 'Location',
              value: p.location || defaultInfo[3].value,
              href: null,
            },
          ]);
        }
      })
      .catch(() => {});

    // Fetch details copy
    fetch('/api/details')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.details?.contact_intro) {
          setContactIntro(data.details.contact_intro);
        }
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

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '64px',
          textAlign: 'center',
          color: 'var(--text-primary)',
        }}>
          Get In Touch
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Left Column — Contact Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Let&apos;s Connect
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              {contactIntro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              {contactList.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    transition: 'border-color 0.15s ease',
                  }}>
                    <Icon size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '2px' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ textDecoration: 'none' }}
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={index}>{content}</div>;
              })}
            </div>
          </div>

          {/* Right Column — Contact Form */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '32px',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="subject" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                  transition: 'opacity 0.15s ease',
                  marginTop: '8px',
                }}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '4px' }}>
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontSize: '0.875rem', color: 'var(--error)', marginTop: '4px' }}>
                  Something went wrong. Please try again later.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
