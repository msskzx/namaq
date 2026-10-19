"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';
import { useLanguage } from '../language/LanguageContext';
import Toggle from '../common/Toggle';

export default function ThemeSwitcher({ palette = 'default' }: { palette?: 'default' | 'site' } = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="inline-block h-7 w-[52px] shrink-0" aria-hidden="true" />;
  return (
    <Toggle
      palette={palette}
      checked={resolvedTheme === 'dark'}
      label={language === 'ar' ? 'الوضع الداكن' : 'Dark mode'}
      onChange={dark => setTheme(dark ? 'dark' : 'light')}
      offIcon={<FontAwesomeIcon icon={faSun} className="size-3" />}
      onIcon={<FontAwesomeIcon icon={faMoon} className="size-3" />}
    />
  );
}
