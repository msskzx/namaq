"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '../language/LanguageContext';
import Toggle from '../common/Toggle';
import styles from '../common/NavBar.module.css';

export default function ThemeSwitcher({ palette = 'default' }: { palette?: 'default' | 'site' } = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className={`inline-block shrink-0 ${palette === 'site' ? 'size-[1.875rem]' : 'h-7 w-[52px]'}`} aria-hidden="true" />;
  if (palette === 'site') {
    const dark = resolvedTheme === 'dark';
    const label = dark
      ? (language === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode')
      : (language === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode');
    return (
      <button type="button" className={styles.iconButton} aria-label={label} title={label} onClick={() => setTheme(dark ? 'light' : 'dark')}>
        {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      </button>
    );
  }
  return (
    <Toggle
      palette={palette}
      checked={resolvedTheme === 'dark'}
      label={language === 'ar' ? 'الوضع الداكن' : 'Dark mode'}
      onChange={dark => setTheme(dark ? 'dark' : 'light')}
      offIcon={<Sun className="size-3" />}
      onIcon={<Moon className="size-3" />}
    />
  );
}
