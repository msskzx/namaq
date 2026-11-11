"use client";

import React, { useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftRight, BookOpen, CircleHelp, Feather, Play, Settings, ShieldCheck, type LucideIcon } from 'lucide-react';
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
import styles from './NavBar.module.css';

export const SECTION_ICONS: Record<string, LucideIcon | typeof TreeIcon> = {
  '/quran/branches': TreeIcon,
  '/quran/compare': ArrowLeftRight,
  '/quran/read': BookOpen,
  '/quizzes': Feather,
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
  const help = usePageHelp();
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
          {help && <details className="group">
            <summary className={`${styles.sheetLink} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
              <CircleHelp size={20} aria-hidden /><span>{help.label}</span>
            </summary>
            <div data-page-help className="flex flex-col gap-2 px-3 pb-3 text-sm text-[var(--home-muted)]">{help.content}</div>
          </details>}
          {links.map(({ href, icon, label }) => (
            <Link key={href} href={href} className={styles.sheetLink} onClick={onClose}>
              {icon}<span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
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
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  const close = useCallback(() => { setOpen(false); toggle.current?.focus(); }, []);
  const setRailSlot = useContext(RailSlotContext);
  const ar = language === 'ar';
  const settings = ar ? 'الإعدادات' : 'Settings';
  return (
    <>
      {open && <SettingsSheet id={sheetId} onClose={close} toggle={toggle} />}
      <nav className={styles.tabs} aria-label={ar ? 'شريط التبويب' : 'Tab bar'} dir={ar ? 'rtl' : 'ltr'}>
        <Link href="/" className={styles.railLogo} aria-label={ar ? 'نمق' : 'Namaq'} title={ar ? 'نمق' : 'Namaq'}><Emblem className={styles.railEmblem} /></Link>
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
        <div ref={setRailSlot} className={styles.railActions} />
        <button ref={toggle} type="button" className={styles.tab} aria-label={settings} title={settings}
          aria-expanded={open} aria-controls={open ? sheetId : undefined} onClick={() => setOpen(value => !value)}>
          <span className={styles.tabPill}><Settings size={24} strokeWidth={1.75} aria-hidden /></span>
        </button>
      </nav>
    </>
  );
}
