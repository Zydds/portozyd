// Shared SVG filter defs (server-rendered) + full-page grain.
// The grain itself is a static tiled texture (public/grain.svg) applied in
// globals.css — no live feTurbulence, no client hydration.
export default function GrainOverlay() {
  return (
    <>
      {/* Shared SVG filter definitions — rendered once, referenced via url(#id) */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="dither">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n"/>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.30  0 0 0 0 1  0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>

      <div className="grain" aria-hidden="true" />
    </>
  );
}
