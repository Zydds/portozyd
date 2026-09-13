'use client';

import { RiMailLine, RiGithubLine, RiLinkedinLine, RiMapPinLine } from 'react-icons/ri';

const contactInfo = [
  {
    icon: RiMailLine,
    label: 'Email',
    value: 'zaidan.azhar@example.com',
    href: 'mailto:zaidan.azhar@example.com',
  },
  {
    icon: RiGithubLine,
    label: 'GitHub',
    value: 'github.com/zaidanazhar',
    href: 'https://github.com/zaidanazhar',
  },
  {
    icon: RiLinkedinLine,
    label: 'LinkedIn',
    value: 'linkedin.com/in/zaidanazhar',
    href: 'https://linkedin.com/in/zaidanazhar',
  },
  {
    icon: RiMapPinLine,
    label: 'Location',
    value: 'Jakarta, Indonesia',
    href: null,
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
  return (
    <section id="contact" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          Get In Touch
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '64px',
        }}>
          Have a project in mind or want to collaborate? Let&apos;s connect.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
        }}>
          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>
              Contact Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Icon size={22} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      {label}
                    </div>
                    {href ? (
                      <a href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{ fontSize: '0.9375rem', color: 'var(--accent-primary)', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
                      >
                        {value}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>
              Send a Message
            </h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
                { id: 'subject', label: 'Subject', type: 'text', placeholder: "What's this about?" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    {label}
                  </label>
                  <input id={id} type={type} placeholder={placeholder} required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.background = 'var(--bg-secondary)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-tertiary)'; }}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}>
                  Message
                </label>
                <textarea id="message" required placeholder="Tell me about your project or idea..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.background = 'var(--bg-secondary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-tertiary)'; }}
                />
              </div>

              <button type="submit" style={{
                width: '100%',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-primary)'; }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
