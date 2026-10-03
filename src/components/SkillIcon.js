'use client';

import { useState } from 'react';
import {
  SiJavascript, SiPython, SiPhp, SiTypescript,
  SiReact, SiNextdotjs, SiVuedotjs, SiNodedotjs,
  SiTailwindcss, SiWordpress, SiLaravel,
  SiCypress, SiJest, SiPostman,
  SiNotion, SiGit, SiGithub, SiJira,
  SiFigma, SiDocker, SiKubernetes,
  SiLinux, SiApple, SiAndroid,
  SiTrello, SiConfluence,
} from 'react-icons/si';
import { VscBeaker } from 'react-icons/vsc';

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
  'figma': SiFigma,
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'linux': SiLinux,
  'apple': SiApple,
  'android': SiAndroid,
  'trello': SiTrello,
  'confluence': SiConfluence,
  'beaker': VscBeaker,
};

export default function SkillIcon({ name = '', iconKey = '', color = '#6366F1', size = 32, style = {} }) {
  const [imgError, setImgError] = useState(false);

  // Normalize lookups
  const lookupKey = (iconKey || name).toLowerCase().trim();
  const slug = lookupKey.replace(/[^a-z0-9]/g, '');
  const hexColor = (color || '#6366F1').replace('#', '');

  // 1. Direct local React-Icon
  const LocalIcon = localIconMap[lookupKey] || localIconMap[slug];
  if (LocalIcon) {
    return <LocalIcon size={size} color={color} style={style} />;
  }

  // 2. Custom direct URL
  if (iconKey && (iconKey.startsWith('http://') || iconKey.startsWith('https://'))) {
    if (!imgError) {
      return (
        <img
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
      <img
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
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid ${color}`,
        color: color,
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
