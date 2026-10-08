'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import {
  SiJavascript, SiPython, SiPhp, SiTypescript,
  SiReact, SiNextdotjs, SiVuedotjs, SiNodedotjs,
  SiTailwindcss, SiWordpress, SiLaravel,
  SiCypress, SiJest, SiPostman,
  SiNotion, SiGit, SiGithub, SiJira, SiGitlab,
  SiFigma, SiDocker, SiKubernetes,
  SiLinux, SiApple, SiAndroid,
  SiTrello, SiConfluence,
} from 'react-icons/si';
import { VscBeaker } from 'react-icons/vsc';

// Custom Flag & Brand SVG Components
function IndonesianFlag({ size = 20, style = {} }) {
  const h = Math.round(size * 0.7);
  return (
    <svg width={size} height={h} viewBox="0 0 600 400" style={{ borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(128,128,128,0.25)', flexShrink: 0, ...style }}>
      <rect width="600" height="200" fill="#E70011" />
      <rect y="200" width="600" height="200" fill="#FFFFFF" />
    </svg>
  );
}

function UKFlag({ size = 20, style = {} }) {
  const h = Math.round(size * 0.7);
  return (
    <svg width={size} height={h} viewBox="0 0 60 30" style={{ borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(128,128,128,0.25)', flexShrink: 0, ...style }}>
      <clipPath id="uk-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function MSOfficeIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>
      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#FFB900" />
    </svg>
  );
}

function CanvaIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle cx="12" cy="12" r="12" fill="url(#canva-gradient)" />
      <path
        fill="#FFFFFF"
        d="M6.962 7.68c.754 0 1.337.549 1.405 1.2c.069.583-.171 1.097-.822 1.406c-.343.171-.48.172-.549.069c-.034-.069 0-.137.069-.206c.617-.514.617-.926.548-1.508c-.034-.378-.308-.618-.583-.618c-1.2 0-2.914 2.674-2.674 4.629c.103.754.549 1.646 1.509 1.646c.308 0 .65-.103.96-.24c.5-.264.799-.47 1.097-.8c-.073-.885.704-2.046 1.851-2.046c.515 0 .926.205.96.583c.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378c-.035-.206-.24-.274-.446-.274c-.72 0-1.131.994-1.029 1.611c.035.275.172.549.447.549c.205 0 .514-.31.617-.755c.068-.308.343-.514.583-.514c.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651c0 .069.034.171.17.171c.092 0 .436-.18.777-.459c.117-.59.253-1.298.253-1.357c.034-.24.137-.48.617-.48c.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994c.172 0 .309.102.309.274c0 .103 0 .274-.069.446c-.137.377-.309.96-.412 1.474c0 .137.035.274.207.274s.685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202c0-.411.035-.754.104-.994c.068-.274.411-.514.617-.514c.103 0 .205.069.205.171c0 .035 0 .103-.034.137c-.137.446-.24.857-.24 1.269c0 .24.034.582.102.788c0 .034.035.069.07.069c.068 0 .548-.445.89-1.028c-.308-.206-.48-.549-.48-.96c0-.72.446-1.097.858-1.097c.343 0 .617.24.617.72c0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24a.3.3 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74c.48 0 .924.205.959.582c.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172s.309-.068.274-.376c-.034-.206-.24-.275-.446-.275c-.686 0-1.13.891-1.028 1.611c.034.275.171.583.445.583c.206 0 .515-.308.652-.754c.068-.274.343-.514.583-.514c.103 0 .17.034.205.171c0 .069 0 .206-.137.652c-.17.308-.171.48-.137.617c.034.274.171.48.309.583c.034.034.068.102.068.102c0 .069-.034.138-.137.138c-.034 0-.068 0-.103-.035c-.514-.205-.72-.548-.789-.891c-.205.24-.445.377-.72.377c-.445 0-.89-.411-.96-.926a1.6 1.6 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.9.9 0 0 1-.377.104c-.068 0-.171-.035-.205-.104c-.095-.152-.156-.392-.193-.667c-.481.527-1.145.805-1.453.805c-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515c-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508c-.308 0-.48-.172-.514-.412c-.206.274-.445.412-.754.412c-.352 0-.696-.24-.862-.593c-.244.275-.523.553-.852.764c-.48.309-1.028.549-1.68.549c-.582 0-1.097-.309-1.371-.583c-.412-.377-.651-.96-.686-1.509c-.205-1.68.823-3.84 2.4-4.8c.378-.205.755-.343 1.132-.343m9.77 3.291c-.104 0-.172.172-.172.343c0 .274.137.583.309.755a1.7 1.7 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z"
      />
      <defs>
        <linearGradient id="canva-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C4CC" />
          <stop offset="1" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const localIconMap = {
  'javascript': SiJavascript,
  'js': SiJavascript,
  'typescript': SiTypescript,
  'ts': SiTypescript,
  'python': SiPython,
  'php': SiPhp,
  'react': SiReact,
  'nextjs': SiNextdotjs,
  'next.js': SiNextdotjs,
  'vuejs': SiVuedotjs,
  'vue.js': SiVuedotjs,
  'nodejs': SiNodedotjs,
  'node.js': SiNodedotjs,
  'tailwindcss': SiTailwindcss,
  'tailwind': SiTailwindcss,
  'wordpress': SiWordpress,
  'laravel': SiLaravel,
  'cypress': SiCypress,
  'playwright': VscBeaker,
  'jest': SiJest,
  'postman': SiPostman,
  'notion': SiNotion,
  'git': SiGit,
  'github': SiGithub,
  'jira': SiJira,
  'gitlab': SiGitlab,
  'figma': SiFigma,
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'linux': SiLinux,
  'apple': SiApple,
  'android': SiAndroid,
  'trello': SiTrello,
  'confluence': SiConfluence,
  'beaker': VscBeaker,

  // Soft Skills & Languages
  'ms office': MSOfficeIcon,
  'microsoft office': MSOfficeIcon,
  'office': MSOfficeIcon,
  'msoffice': MSOfficeIcon,
  'canva': CanvaIcon,
  'canva (basic editing)': CanvaIcon,
  'canva basic editing': CanvaIcon,
  'canvabasicediting': CanvaIcon,
  'indonesian': IndonesianFlag,
  'indonesian (native)': IndonesianFlag,
  'indonesian native': IndonesianFlag,
  'indonesia': IndonesianFlag,
  'id': IndonesianFlag,
  'english': UKFlag,
  'english speaking': UKFlag,
  'englishspeaking': UKFlag,
  'en': UKFlag,
  'uk': UKFlag,
};

// Returns a color that meets WCAG AA contrast on white (#FFFFFF) and dark (#0A0A0A) backgrounds
function resolveIconColor(color, theme) {
  if (!color || color === '#6366F1') return theme === 'light' ? '#4F46E5' : '#6366F1';

  // Parse hex
  const hex = color.replace('#', '');
  if (hex.length < 6) return color;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return color;

  // Relative luminance (WCAG)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (theme === 'light' && lum >= 0.55) {
    const factor = 0.55;
    const nr = Math.round(r * factor);
    const ng = Math.round(g * factor);
    const nb = Math.round(b * factor);
    return `rgb(${nr},${ng},${nb})`;
  }

  if (theme === 'dark' && lum < 0.25) {
    const factor = 1.4;
    const nr = Math.min(255, Math.round(r * factor));
    const ng = Math.min(255, Math.round(g * factor));
    const nb = Math.min(255, Math.round(b * factor));
    return `rgb(${nr},${ng},${nb})`;
  }

  return color;
}

export default function SkillIcon({ name = '', iconKey = '', color = '#6366F1', size = 32, style = {} }) {
  const [imgError, setImgError] = useState(false);
  const { theme } = useTheme();

  const resolvedColor = useMemo(() => resolveIconColor(color, theme), [color, theme]);

  // Normalize lookups
  const lookupKey = (iconKey || name).toLowerCase().trim();
  const slug = lookupKey.replace(/[^a-z0-9]/g, '');
  const hexColor = (resolvedColor || '#6366F1').replace('#', '');

  // 1. Direct local React-Icon or Custom SVG
  const LocalIcon = localIconMap[lookupKey] || localIconMap[slug];
  if (LocalIcon) {
    return <LocalIcon size={size} color={resolvedColor} style={style} />;
  }

  // 2. Custom direct URL
  if (iconKey && (iconKey.startsWith('http://') || iconKey.startsWith('https://'))) {
    if (!imgError) {
      return (
        <Image
          src={iconKey}
          alt={name}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain', ...style }}
        />
      );
    }
  }

  // 3. SimpleIcons CDN
  if (!imgError && slug) {
    const cdnUrl = `https://cdn.simpleicons.org/${slug}/${hexColor}`;
    return (
      <Image
        src={cdnUrl}
        alt={name}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain', ...style }}
      />
    );
  }

  // 4. Monogram Badge Fallback
  const initials = (name || iconKey || '?')
    .split(/[\s-_]+/)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '6px',
        background: `color-mix(in srgb, ${resolvedColor} 15%, transparent)`,
        border: `1px solid ${resolvedColor}`,
        color: resolvedColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.max(10, Math.floor(size * 0.4))}px`,
        fontWeight: 700,
        letterSpacing: '0.05em',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
