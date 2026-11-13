"use client";

import React, { useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CircleHelp, Compass, Feather, House, Play, Search, Settings, ShieldCheck, type LucideIcon } from 'lucide-react';
import { usePageHelp } from './SettingsHelp';
import ThemeTiles from '@/components/theme/ThemeTiles';
import { useLanguage } from '../language/LanguageContext';
import { NAV_SECTIONS, activeSection } from '@/lib/navigation';
import Emblem from './Emblem';
import { RailSlotContext } from './NavBar';
import TreeIcon from './TreeIcon';
import BranchConnectorSetting from '@/components/quran/BranchConnectorSetting';
import BranchViewSetting from '@/components/quran/BranchViewSetting';
import ReaderGestureSetting from '@/components/quran/ReaderGestureSetting';
import { useSwipeClose } from './useSwipeClose';
import PageHint, { resetHints } from './PageHint';
import styles from './NavBar.module.css';

export const SECTION_ICONS: Record<string, LucideIcon | typeof TreeIcon> = {
  '/quran': TreeIcon,
  '/quran/read': BookOpen,
  '/': House,
  '/quizzes': Feather,
  '/utilities': Compass,
};

function SettingsSheet({ id, onClose, toggle }: { id: string; onClose: () => void; toggle: React.RefObject<HTMLButtonElement | null> }) {
  const { language, toggleLanguage } = useLanguage();
  const ar = language === 'ar';
  const sheet = useRef<HTMLDivElement>(null);
  useSwipeClose(sheet, true, { direction: 'down', onClose });
  useEffect(() => {
    const element = sheet.current;
    element?.querySelector<HTMLElement>('button, a')?.focus();
    // Modal: Escape closes from anywhere, Tab cycles inside the sheet, and no other key reaches
    // the page's own shortcuts behind it (reader page turns, tree steps).
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return; }
      if (event.key !== 'Tab' || !element) { event.stopPropagation(); return; }
      const items = [...element.querySelectorAll<HTMLElement>('button, a, select')];
      const first = items[0], last = items[items.length - 1];
      if (!element.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    // Phones show a bottom sheet, desktops a panel beside the rail: close it when the layout switches.
    const onWide = () => onClose();
    const wide = window.matchMedia?.('(min-width: 1024px)');
    // Desktop has no shade: a press outside the panel closes it and still reaches what was pressed.
    // Phones keep the shade, which closes the sheet without pressing what lies under it.
    const onPointer = (event: PointerEvent) => {
      if (!wide?.matches) return;
      const target = event.target as Node;
      if (!element?.contains(target) && !toggle.current?.contains(target)) onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey, true);
    wide?.addEventListener?.('change', onWide);
    return () => { document.removeEventListener('pointerdown', onPointer); window.removeEventListener('keydown', onKey, true); wide?.removeEventListener?.('change', onWide); };
  }, [onClose, toggle]);
  const links = [
    { href: '/?tour=1', icon: <Play size={20} aria-hidden />, label: ar ? 'الجولة التعريفية' : 'Tour' },
    { href: '/about', icon: <Emblem className={styles.sheetEmblem} />, label: ar ? 'عن نمق' : 'About Namaq' },
    { href: '/privacy', icon: <ShieldCheck size={20} aria-hidden />, label: ar ? 'سياسة الخصوصية' : 'Privacy policy' },
  ];
  return (
    <>
      <div className={styles.shade} onClick={onClose} aria-hidden />
      <div ref={sheet} id={id} role="dialog" aria-modal="true" aria-label={ar ? 'الإعدادات' : 'Settings'} className={styles.sheet} dir={ar ? 'rtl' : 'ltr'}>
        <div className={styles.grab} aria-hidden />
        <div className={styles.sheetRow}>
          <h2 className="text-lg font-bold">{ar ? 'الإعدادات' : 'Settings'}</h2>
          <div className={styles.segment} role="group" aria-label={ar ? 'اللغة' : 'Language'}>
            {(['ar', 'en'] as const).map(value => (
              <button key={value} type="button" lang={value} aria-pressed={language === value} title={value === 'ar' ? 'العربية' : 'English'}
                aria-label={value === 'ar' ? 'العربية' : 'English'} onClick={() => { if (language !== value) toggleLanguage(); }}>
                {value === 'ar' ? 'ع' : 'EN'}
              </button>
            ))}
          </div>
        </div>
        <ThemeTiles />
        <BranchViewSetting />
        <BranchConnectorSetting />
        <ReaderGestureSetting />
        <div className={styles.sheetLinks}>
          {links.map(({ href, icon, label }) => (
            <Link key={href} href={href} className={styles.sheetLink} onClick={() => { if (href === '/?tour=1') resetHints(); onClose(); }}>
              {icon}<span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/** The page's help (its rules and colour legend), opened from the question mark in the top bar, as in the app. */
function HelpSheet({ id, onClose, help }: { id: string; onClose: () => void; help: { label: string; content: React.ReactNode } }) {
  const { language } = useLanguage();
  const sheet = useRef<HTMLDivElement>(null);
  useSwipeClose(sheet, true, { direction: 'down', onClose });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);
  return (
    <>
      <div className={styles.shade} onClick={onClose} aria-hidden />
      <div ref={sheet} id={id} role="dialog" aria-modal="true" aria-label={help.label} className={styles.sheet} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={styles.grab} aria-hidden />
        <h2 className="text-lg font-bold">{help.label}</h2>
        <div data-page-help className="flex flex-col gap-2 text-[var(--home-ink)] leading-7">{help.content}</div>
      </div>
    </>
  );
}

/** A question mark that opens the page's help; shows only on pages that have one. */
export function HelpButton({ className }: { className: string }) {
  const help = usePageHelp();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const id = useId();
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  const close = useCallback(() => setOpen(false), []);
  if (!help) return null;
  const label = language === 'ar' ? 'مساعدة' : 'Help';
  return (
    <>
      <button type="button" className={className} aria-label={label} title={label} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)}>
        <CircleHelp size={22} strokeWidth={1.75} aria-hidden />
      </button>
      {/* On the body: the see-through top bar's blur would otherwise hold a fixed sheet inside the bar. */}
      {open && createPortal(<HelpSheet id={id} onClose={close} help={help} />, document.body)}
    </>
  );
}

/** The settings gear and its sheet: in the side rail on desktop, and in the homepage's top bar on phones, as in the app. */
export function SettingsButton({ className, children }: { className: string; children?: (icon: React.ReactNode) => React.ReactNode }) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  const close = useCallback(() => { setOpen(false); toggle.current?.focus(); }, []);
  const settings = language === 'ar' ? 'الإعدادات' : 'Settings';
  const icon = <Settings size={children ? 24 : 22} strokeWidth={1.75} aria-hidden />;
  return (
    <>
      {open && createPortal(<SettingsSheet id={sheetId} onClose={close} toggle={toggle} />, document.body)}
      <button ref={toggle} type="button" className={className} aria-label={settings} title={settings}
        aria-expanded={open} aria-controls={open ? sheetId : undefined} onClick={() => setOpen(value => !value)}>
        {children ? children(icon) : icon}
      </button>
    </>
  );
}

/** The one search (/search): in the side rail on desktop, and beside the gear in the homepage's top bar on phones, as in the app. */
export function SearchButton({ className, children }: { className: string; children?: (icon: React.ReactNode) => React.ReactNode }) {
  const { language } = useLanguage();
  const label = language === 'ar' ? 'البحث' : 'Search';
  const icon = <Search size={children ? 24 : 22} strokeWidth={1.75} aria-hidden />;
  return <Link href="/search" className={className} aria-label={label} title={label}>{children ? children(icon) : icon}</Link>;
}

/** Keeps page content clear of the phone tab bar; render it after the page. */
export function TabSpacer() {
  return <div className={styles.tabSpacer} />;
}

/** Section tabs plus settings, icon-only with names for screen readers and on hover: bottom bar on phones, side rail on desktop.
 *  Render it before the page so keyboard users reach the sections first. */
export default function TabBar() {
  const { language: chosen, languageLoaded } = useLanguage();
  // Same fallback as the server render, so the links exist before the language loads.
  const language = languageLoaded ? chosen : 'ar';
  const path = usePathname() ?? '/';
  const active = activeSection(path);
  const setRailSlot = useContext(RailSlotContext);
  const ar = language === 'ar';
  return (
    <>
      <nav className={styles.tabs} aria-label={ar ? 'شريط التبويب' : 'Tab bar'} dir={ar ? 'rtl' : 'ltr'}>
        <Link href="/" className={styles.railLogo} aria-label={ar ? 'نمق' : 'Namaq'} title={ar ? 'نمق' : 'Namaq'}><Emblem className={styles.railEmblem} /></Link>
        {NAV_SECTIONS.map(section => {
          const Icon = SECTION_ICONS[section.href];
          const label = section.label[language];
          return (
            <Link key={section.href} href={section.href} className={styles.tab} aria-label={label} title={label}
              aria-current={section.href === active ? 'page' : undefined}>
              <span className={styles.tabPill}><Icon size={24} strokeWidth={section.href === active ? 2.25 : 1.75} aria-hidden /></span>
            </Link>
          );
        })}
        <div ref={setRailSlot} className={styles.railActions} />
        <SearchButton className={`${styles.tab} ${styles.railOnly}`}>{icon => <span className={styles.tabPill}>{icon}</span>}</SearchButton>
        <HelpButton className={`${styles.tab} ${styles.railOnly}`} />
        <SettingsButton className={`${styles.tab} ${styles.railOnly}`}>{icon => <span className={styles.tabPill}>{icon}</span>}</SettingsButton>
      </nav>
      <PageHint />
    </>
  );
}
