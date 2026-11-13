"use client";

import React, { createContext, useContext, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../language/LanguageContext';
import { ChevronLeft, ChevronRight, X, Menu } from 'lucide-react';
import translations from '../language/translations';
import Button from './Button';
import Emblem from './Emblem';
import { NAV_SECTIONS, activeSection, isQuranTool } from '@/lib/navigation';
import { HelpButton, SearchButton, SettingsButton } from './TabBar';
import styles from './NavBar.module.css';

export { NAV_SECTIONS, activeSection } from '@/lib/navigation';

/** AppChrome keeps the element of the top bar's page-actions slot here. */
export const NavSlotContext = createContext<(element: HTMLDivElement | null) => void>(() => {});
export const NavSlotElement = createContext<HTMLDivElement | null>(null);

/** The side rail's slot for page buttons on desktop (TabBar fills it). */
export const RailSlotContext = createContext<(element: HTMLDivElement | null) => void>(() => {});
export const RailSlotElement = createContext<HTMLDivElement | null>(null);

/** Puts a page's own search box (or other wide input) into the top bar. */
export function NavActions({ children }: { children: React.ReactNode }) {
  const slot = useContext(NavSlotElement);
  return slot ? createPortal(children, slot) : null;
}

const WIDE = '(min-width: 1024px)';
const subscribeWide = (change: () => void) => {
  const query = window.matchMedia?.(WIDE);
  query?.addEventListener?.('change', change);
  return () => query?.removeEventListener?.('change', change);
};

function useWideNav() {
  return useSyncExternalStore(subscribeWide, () => !!window.matchMedia?.(WIDE).matches, () => false);
}

export function useDesktopRail() {
  const rail = useContext(RailSlotElement);
  return useWideNav() ? rail : null;
}

/** Puts a page's own icon buttons and toggles into the side rail on desktop, and into the top bar on phones
 *  (or, with `bottom`, into the bottom tab bar on phones). */
export function NavButtons({ children, bottom = false }: { children: React.ReactNode; bottom?: boolean }) {
  const top = useContext(NavSlotElement);
  const rail = useContext(RailSlotElement);
  const wide = useWideNav();
  const slot = (wide || bottom) && rail ? rail : top;
  return slot ? createPortal(children, slot) : null;
}

/** True after the page scrolls down past the bar, false again as soon as it scrolls up. `show` brings it back, e.g. on focus. */
export function useHideOnScroll(threshold = 8) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y < 64) setHidden(false);
      else if (y - last > threshold) setHidden(true);
      else if (last - y > threshold) setHidden(false);
      else return;
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [threshold]);
  return [hidden, () => setHidden(false)] as const;
}

export default function NavBar() {
  const { language, languageLoaded } = useLanguage();
  const path = usePathname() ?? '/';
  const menuOnly = /^\/quizzes\/party\/[^/]+/.test(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const actions = useRef<HTMLDivElement>(null);
  const [scrolledAway, showBar] = useHideOnScroll();
  const setPageSlot = useContext(NavSlotContext);
  if (!languageLoaded && menuOnly) return null;
  if (!languageLoaded) {
    return <><nav className={styles.bar}><div className={styles.band} /></nav><div className={styles.spacer} /></>;
  }

  const active = activeSection(path);
  const ar = language === 'ar';
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={menuOnly ? styles.menuOnly : `${styles.bar} ${scrolledAway ? styles.scrolledAway : ''}`} aria-label={ar ? 'الأبواب' : 'Main'} dir={ar ? 'rtl' : 'ltr'}
        onFocus={showBar}
        onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { closeMenu(); actions.current?.querySelector<HTMLButtonElement>('button[aria-controls]')?.focus(); } }}>
        <div className={styles.band}>
          {/* As in the app: a Quran tool (trees, compare, prophets, Tuhfa) shows a back arrow to the Quran hub in the logo's place. */}
          {!menuOnly && (isQuranTool(path)
            ? <Link href="/quran" className={styles.wordmark} aria-label={ar ? 'رجوع' : 'Back'} title={ar ? 'رجوع' : 'Back'}>{ar ? <ChevronRight size={28} aria-hidden /> : <ChevronLeft size={28} aria-hidden />}</Link>
            : <Link href="/" className={styles.wordmark} aria-label={translations[language].appName}><Emblem className={styles.emblem} /></Link>)}
          <div ref={setPageSlot} className={styles.pageActions} />
          <div ref={actions} className={styles.actions}>
            {/* As in the app: the page's help, and the settings gear on the homepage only. Desktop keeps both in the rail. */}
            {!menuOnly && <HelpButton className={`${styles.topButton} ${styles.phoneOnly}`} />}
            {!menuOnly && path === '/' && <SearchButton className={`${styles.topButton} ${styles.phoneOnly}`} />}
            {!menuOnly && path === '/' && <SettingsButton className={`${styles.topButton} ${styles.phoneOnly}`} />}
            {menuOnly && <Button size="icon" className={styles.menuButton}
              onClick={() => setMenuOpen(open => !open)}
              aria-expanded={menuOpen} aria-controls={menuId}
              aria-label={menuOpen ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')}>
              {menuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </Button>}
          </div>
        </div>
        {menuOnly && menuOpen && (
          <div id={menuId} className={styles.mobile}>
            {NAV_SECTIONS.map(section => (
              <Link key={section.href} href={section.href} className={styles.mobileChapter} aria-current={section.href === active ? 'page' : undefined} onClick={closeMenu}>{section.label[language]}</Link>
            ))}
          </div>
        )}
      </nav>
      <div className={menuOnly ? styles.partySpacer : styles.spacer} />
    </>
  );
}
