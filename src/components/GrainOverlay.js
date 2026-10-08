'use client';

import { useState, useEffect } from 'react';

export default function GrainOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Shared SVG filter definitions — rendered once, referenced everywhere via url(#id) */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="dither">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n"/>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.30  0 0 0 0 1  0 0 0 1 0"/>
          </filter>
          <filter id="dither2">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="21" result="n"/>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.30  0 0 0 0 1  0 0 0 1 0"/>
          </filter>
          <filter id="grainFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.30  0 0 0 0 1  0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>

      {/* Full-page grain overlay */}
      <div className="grain" style={{ filter: 'url(#grainFilter)' }} />
    </>
  );
}
