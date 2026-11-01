"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BookOpen, GitFork, Info, ListChecks, Monitor, Moon, Settings, ShieldCheck, Sun, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import { NAV_SECTIONS, activeSection } from '@/lib/navigation';
import styles from './NavBar.module.css';

export const SECTION_ICONS: Record<string, LucideIcon> = {
  '/quran/branches': GitFork,
  '/quran/read': BookOpen,
  '/quizzes': ListChecks,
};

function SettingsSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const ar = language === 'ar';
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => { sheet.current?.querySelector<HTMLElement>('button, a')?.focus(); }, []);
  const themes = [
    { value: 'light', Icon: Sun, label: ar ? 'فاتح' : 'Light' },
    { value: 'dark', Icon: Moon, label: ar ? 'داكن' : 'Dark' },
    { value: 'system', Icon: Monitor, label: ar ? 'حسب الجهاز' : 'Device' },
  ];
  const links = [
    { href: '/about', Icon: Info, label: ar ? 'حول نمق' : 'About Namaq' },
    { href: '/privacy', Icon: ShieldCheck, label: ar ? 'سياسة الخصوصية' : 'Privacy policy' },
  ];
  return (
    <>
      <div className={styles.shade} onClick={onClose} aria-hidden />
      <div ref={sheet} id={id} role="dialog" aria-modal="true" aria-label={ar ? 'الإعدادات' : 'Settings'} className={styles.sheet} dir={ar ? 'rtl' : 'ltr'}
        onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
        <div className={styles.grab} aria-hidden />
        <div className={styles.sheetRow}>
          <div className={styles.segment} role="group" aria-label={ar ? 'اللغة' : 'Language'}>
            {(['ar', 'en'] as const).map(value => (
              <button key={value} type="button" lang={value} aria-pressed={language === value} title={value === 'ar' ? 'العربية' : 'English'}
                aria-label={value === 'ar' ? 'العربية' : 'English'} onClick={() => { if (language !== value) toggleLanguage(); }}>
                {value === 'ar' ? 'ع' : 'EN'}
              </button>
            ))}
          </div>
          <div className={styles.segment} role="group" aria-label={ar ? 'المظهر' : 'Theme'}>
            {themes.map(({ value, Icon, label }) => (
              <button key={value} type="button" aria-pressed={(theme ?? 'system') === value} aria-label={label} title={label} onClick={() => setTheme(value)}>
                <Icon size={20} aria-hidden />
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sheetRow}>
          {links.map(({ href, Icon, label }) => (
            <Link key={href} href={href} className={styles.sheetLink} aria-label={label} title={label} onClick={onClose}>
              <Icon size={20} aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/** Phone-only bottom tabs: an icon per launch section plus settings, labelled for screen readers and on hover. */
export default function TabBar() {
  const { language, languageLoaded } = useLanguage();
  const path = usePathname() ?? '/';
  const active = activeSection(path);
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  if (!languageLoaded) return <div className={styles.tabSpacer} />;
  const ar = language === 'ar';
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const settings = ar ? 'الإعدادات' : 'Settings';
  return (
    <>
      <div className={styles.tabSpacer} />
      {open && <SettingsSheet id={sheetId} onClose={close} />}
      <nav className={styles.tabs} aria-label={ar ? 'الأبواب' : 'Sections'} dir={ar ? 'rtl' : 'ltr'}>
        {NAV_SECTIONS.map(section => {
          const Icon = SECTION_ICONS[section.href];
          const label = section.label[language];
          return (
            <Link key={section.href} href={section.href} className={styles.tab} aria-label={label} title={label}
              aria-current={section.href === active ? 'page' : undefined}>
              <span className={styles.tabPill}><Icon size={24} strokeWidth={1.75} aria-hidden /></span>
            </Link>
          );
        })}
        <button ref={toggle} type="button" className={styles.tab} aria-label={settings} title={settings}
          aria-expanded={open} aria-controls={open ? sheetId : undefined} onClick={() => setOpen(value => !value)}>
          <span className={styles.tabPill}><Settings size={24} strokeWidth={1.75} aria-hidden /></span>
        </button>
      </nav>
    </>
  );
}
