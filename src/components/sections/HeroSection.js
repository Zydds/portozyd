import Link from 'next/link';

export default function HeroSection({ details = {}, profile = {} }) {
  const name = profile.name || 'Zaidan Ghiffari Azhar';
  const tagline = details.hero_tagline || "I test software until it breaks, then build the parts that shouldn't.";
  const based = profile.location || 'Bandung, ID';
  const focus = details.hero_focus || 'QA, Web Development, Project Management';
  const status = details.hero_status || 'open to work';
  const primaryLabel = details.hero_cta_primary_label || 'View my work';
  const primaryHref = details.hero_cta_primary_href || '#contact';
  const secondaryLabel = details.hero_cta_secondary_label || 'Get in touch';
  const secondaryHref = details.hero_cta_secondary_href || '#about';
  const videoUrl = details.hero_video_url || '/videos/me-static.mp4';
  const poster = details.hero_poster_url || '/videos/me-static-poster.webp';

  return (
    <section className="wrap hero">
      <div>
        <h1>{name}</h1>
        <p className="hero-role">
          {tagline}{' '}
        </p>
        <div className="hero-meta">
          <span><b>Based</b> {based}</span>
          <span><b>Focus</b> {focus}</span>
          <span><b>Status</b> {status}</span>
        </div>
        <div className="hero-ctas">
          <Link href={primaryHref} className="btn btn-primary">{primaryLabel}</Link>
          <Link href={secondaryHref} className="btn btn-ghost">{secondaryLabel}</Link>
        </div>
      </div>
      <div className="dither-panel hero-visual">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          src={videoUrl}
          aria-hidden="true"
          suppressHydrationWarning
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: '#060608',
            opacity: 0.15,
            mixBlendMode: 'screen',
            filter: 'url(#dither)',
          }}
        />
      </div>
    </section>
  );
}
