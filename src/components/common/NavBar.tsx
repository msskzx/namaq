"use client";

import React, { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../language/LanguageContext';
import { X, Menu } from 'lucide-react';
import translations from '../language/translations';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import Button from './Button';
import Logo from './Logo';
import Emblem from './Emblem';
import { NAV_SECTIONS, activeSection } from '@/lib/navigation';
import styles from './NavBar.module.css';

export { NAV_SECTIONS, activeSection } from '@/lib/navigation';

export default function NavBar() {
  const { language, languageLoaded, toggleLanguage } = useLanguage();
  const path = usePathname() ?? '/';
  const menuOnly = /^\/quizzes\/party\/[^/]+/.test(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const actions = useRef<HTMLDivElement>(null);
  if (!languageLoaded && menuOnly) return null;
  if (!languageLoaded) {
    return <><nav className={styles.bar}><div className={styles.band} /></nav><div className={styles.spacer} /></>;
  }

  const active = activeSection(path);
  const ar = language === 'ar';
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={menuOnly ? styles.menuOnly : styles.bar} aria-label={ar ? 'الأبواب' : 'Main'} dir={ar ? 'rtl' : 'ltr'}
        onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { closeMenu(); actions.current?.querySelector<HTMLButtonElement>('button[aria-controls]')?.focus(); } }}>
        <div className={styles.band}>
          {!menuOnly && <>
            <Link href="/" className={styles.wordmark} onClick={closeMenu} aria-label={translations[language].appName}><Emblem className={styles.emblem} /><Logo small className={styles.logo} /></Link>
            <ul className={styles.chapters}>
              {NAV_SECTIONS.map(section => (
                <li key={section.href} className={styles.chapter}>
                  <Link href={section.href} aria-current={section.href === active ? 'page' : undefined}>{section.label[language]}</Link>
                </li>
              ))}
            </ul>
          </>}
          <div ref={actions} className={styles.actions}>
            {!menuOnly && <>
              <button type="button" className={styles.language} onClick={toggleLanguage} lang={ar ? 'en' : 'ar'} aria-label={ar ? 'Switch to English' : 'التبديل إلى العربية'}>
                {ar ? 'EN' : 'ع'}
              </button>
              <ThemeSwitcher palette="site" />
            </>}
            <Button size="icon" className={styles.menuButton}
              onClick={() => setMenuOpen(open => !open)}
              aria-expanded={menuOpen} aria-controls={menuId}
              aria-label={menuOpen ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')}>
              {menuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div id={menuId} className={styles.mobile}>
            {NAV_SECTIONS.map(section => (
              <Link key={section.href} href={section.href} className={styles.mobileChapter} aria-current={section.href === active ? 'page' : undefined} onClick={closeMenu}>{section.label[language]}</Link>
            ))}
          </div>
        )}
      </nav>
      {!menuOnly && <div className={styles.spacer} />}
    </>
  );
}
