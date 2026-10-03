'use client';

import { useTheme } from '@/components/ThemeProvider';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
    >
      {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
    </button>
  );
}