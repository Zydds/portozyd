'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="wrap hero">
      <div>
        <h1>Zaidan Ghiffari Azhar</h1>
        <p className="hero-role">
          I test software until it breaks, then build the parts that shouldn&apos;t.{' '}
        </p>
        <div className="hero-meta">
          <span><b>Based</b> Bandung, ID</span>
          <span><b>Focus</b> QA, Web Development, Project Management</span>
          <span><b>Status</b> open to work</span>
        </div>
        <div className="hero-ctas">
          <Link href="#contact" className="btn btn-primary">View my work</Link>
          <Link href="#about" className="btn btn-ghost">Get in touch</Link>
        </div>
      </div>
      <div className="dither-panel hero-visual">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/me-static-poster.webp"
          aria-hidden="true"
          suppressHydrationWarning
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        >
          <source src="/videos/me-static.mp4" type="video/mp4" />
        </video>
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
