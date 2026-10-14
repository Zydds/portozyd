import Link from 'next/link';
import { RiArrowLeftLine } from 'react-icons/ri';
import TopicSectionMedia from '@/components/TopicSectionMedia';

const isVideoUrl = (url) =>
  /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url) || url.includes('/video/upload/');

// Allowed section split ratios (text:media). Anything else falls back to 3:1.
const RATIO_TEXT_MEDIA = { '3:1': [3, 1], '2:1': [2, 1], '1:1': [1, 1], '1:2': [1, 2], '1:3': [1, 3] };

// Resolve a section's grid: returns { cols, mediaLeft }. `cols` is the CSS
// grid-template-columns for [firstColumn, secondColumn]; media sits in the
// media band (25% when 3:1) and never crosses into the text band.
function resolveSplit(ratio, mediaSide) {
  const [text, media] = RATIO_TEXT_MEDIA[ratio] || RATIO_TEXT_MEDIA['3:1'];
  const mediaLeft = mediaSide === 'left';
  // Build columns in visual (left→right) order: media band then text band,
  // or text band then media band, depending on which side the media goes.
  const cols = mediaLeft ? `${media}fr ${text}fr` : `${text}fr ${media}fr`;
  return { cols, mediaLeft };
}

// Topic/content layout. `children` slots a section (e.g. the portfolio card
// grid) between the hero and the body. Body prefers `sections` (blog-style
// 75/25 text+media rows edited in /admin/topics); legacy focus/tools/highlights
// arrays render only as a fallback when a topic has no sections yet.
// Empty arrays skip their block so callers can pass only what they have.
export default function TopicPageLayout({
  icon,
  title,
  intro,
  sections = [],
  focusTitle,
  focusItems = [],
  toolsTitle,
  toolsItems = [],
  highlights = [],
  backHref = '/',
  backLabel = 'Back to Home',
  paddingTop = '96px',
  children,
}) {
  const list = Array.isArray(sections) ? sections.filter(Boolean) : [];
  const hasSections = list.length > 0;
  const hasFocus = focusItems.length > 0;
  const hasTools = toolsItems.length > 0;
  const hasLegacy = hasFocus || hasTools || highlights.length > 0;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `${paddingTop} 32px 96px` }}>
      <Link href={backHref} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '48px',
        transition: 'color 0.15s ease',
      }}>
        <RiArrowLeftLine size={16} />
        {backLabel}
      </Link>

      {/* Hero Block */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{icon}</div>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}>
          {title}
        </h1>
        {intro && (
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {intro}
          </p>
        )}
      </div>

      {children}

      {/* Blog-style sections: text band and media band split by the section ratio */}
      {hasSections && (
        <div className="topic-sections">
          {list.map((section, i) => {
            const heading = section.heading || '';
            const body = section.body || '';
            const mediaUrl = section.mediaUrl || '';
            const isVideo = mediaUrl && isVideoUrl(mediaUrl);
            const { cols, mediaLeft } = resolveSplit(section.ratio, section.mediaSide);
            const paragraphs = String(body)
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean);

            const text = (
              <div className="topic-section-text">
                <div className="topic-section-body">
                  {paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            );
            const media = mediaUrl ? (
              <div className="topic-section-media">
                <TopicSectionMedia
                  src={mediaUrl}
                  alt={heading || 'Section illustration'}
                  isVideo={Boolean(isVideo)}
                />
              </div>
            ) : null;

            return (
              <article
                key={i}
                className={`topic-section${mediaUrl ? '' : ' topic-section--nomedia'}`}
                style={mediaUrl ? { '--section-cols': cols } : undefined}
              >
                {heading && <h2 className="topic-section-heading">{heading}</h2>}
                {mediaUrl && mediaLeft ? media : text}
                {mediaUrl && (mediaLeft ? text : media)}
              </article>
            );
          })}
        </div>
      )}

      {/* Legacy fallback (topics without sections yet) */}
      {!hasSections && hasLegacy && (
        <div className="topic-legacy">
          {hasFocus && (
            <section className="topic-legacy-block">
              <h2>{focusTitle}</h2>
              <ul>
                {focusItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {hasTools && (
            <section className="topic-legacy-block">
              <h2>{toolsTitle}</h2>
              <ul>
                {toolsItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Highlights */}
      {!hasSections && highlights.length > 0 && (
        <div className="topic-legacy">
          <section className="topic-legacy-block">
            <h2>📌 Highlighted Projects &amp; Insights</h2>
            <ul>
              {highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* CTA Box */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        padding: '48px 32px',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>
          Interested in Working Together?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Let&apos;s discuss how we can elevate your project.
        </p>
        <Link href="/#contact" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderRadius: '6px',
          background: 'var(--accent-primary)',
          color: 'white',
          textDecoration: 'none',
        }}>
          Get In Touch
        </Link>
      </div>
    </div>
  );
}
