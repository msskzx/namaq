"use client";

import React, { useState, useRef, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../language/LanguageContext';
import { ChevronDown, X, Menu } from 'lucide-react';
import translations from '../language/translations';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import { QURAN_CARDS } from '@/app/quran/QuranHub';
import Logo from './Logo';
import Emblem from './Emblem';
import styles from './NavBar.module.css';

type Language = 'en' | 'ar';
type Text = Record<Language, string>;
export type NavItem = { href: string; label: Text; purpose: Text };
export type NavSection = { href: string; label: Text; groups: { title?: Text; items: NavItem[] }[] };

const quran = (href: string, label: Text): NavItem => ({ href, label, purpose: QURAN_CARDS.find(card => card.href === href)!.desc });
export const NAV_SECTIONS: NavSection[] = [
  { href: '/quran', label: { ar: 'القرآن', en: 'Quran' }, groups: [
    { title: { ar: 'القراءة', en: 'Read' }, items: [
      quran('/quran/read', { ar: 'المصحف', en: 'The mushaf' }),
      quran('/quran/qiraat', { ar: 'القراءات', en: 'Readings' }),
    ] },
    { title: { ar: 'الألفاظ', en: 'Words' }, items: [
      quran('/quran/branches', { ar: 'فواتح الآيات المشتركة', en: 'Shared ayah openings' }),
      quran('/quran/compare', { ar: 'مقارنة السور', en: 'Compare surahs' }),
      quran('/quran/words', { ar: 'ألفاظ القرآن', en: 'Words of the Quran' }),
    ] },
    { title: { ar: 'الموضوعات', en: 'Themes' }, items: [
      { href: '/quran/prophets/musa', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: 'قصص الأنبياء في القرآن على خط زمني', en: 'The prophets’ stories in the Quran on a timeline' } },
      quran('/quran/iltifat', { ar: 'الالتفات', en: 'Iltifat' }),
      quran('/quran/openings', { ar: 'افتتاح السور', en: 'Surah openings' }),
      quran('/quran/oaths', { ar: 'الأقسام', en: 'Oaths' }),
      quran('/quran/order', { ar: 'ترتيب السور', en: 'Surah order' }),
    ] },
    { title: { ar: 'التجويد', en: 'Tajwid' }, items: [
      quran('/quran/tajwid/tuhfat-al-atfal', { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal' }),
    ] },
  ] },
  { href: '/hadith', label: { ar: 'الحديث', en: 'Hadith' }, groups: [{ items: [
    { href: '/hadith/bukhari-jibril', label: { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' }, purpose: { ar: 'الحديث بإسناده وحواره', en: 'Hadith with their isnad and dialogue' } },
    { href: '/hadith/muslim-jibril', label: { ar: 'صحيح مسلم', en: 'Sahih Muslim' }, purpose: { ar: 'الحديث بإسناده وحواره', en: 'Hadith with their isnad and dialogue' } },
    { href: '/hadith/fath-iman-50', label: { ar: 'فتح الباري', en: 'Fath al-Bari' }, purpose: { ar: 'شرح ابن حجر لصحيح البخاري', en: 'Ibn Hajar’s commentary on Sahih al-Bukhari' } },
  ] }] },
  { href: '/biographies', label: { ar: 'التراجم', en: 'Biographies' }, groups: [
    { title: { ar: 'الأشخاص والأحداث', en: 'People and events' }, items: [
      { href: '/people', label: { ar: 'الأعلام', en: 'Notable people' }, purpose: { ar: 'الأسماء والأنساب والأحوال مع مصادرها', en: 'Names, lineage and lives, with their sources' } },
      { href: '/titles', label: { ar: 'الألقاب', en: 'Titles' }, purpose: { ar: 'الألقاب ومن عُرف بها', en: 'Titles and the people known by them' } },
      { href: '/events', label: { ar: 'الأحداث', en: 'Events' }, purpose: { ar: 'الأحداث والغزوات ومن شهدها', en: 'Events and battles, and who took part' } },
    ] },
    { title: { ar: 'شبكة العلاقات', en: 'Relationships' }, items: [
      { href: '/graphs', label: { ar: 'استكشاف الشبكة', en: 'Explore the graph' }, purpose: { ar: 'استكشف الصلات بين الأشخاص وصفّها بحسب نوع العلاقة', en: 'Explore the connections between people and filter them by relationship' } },
      { href: '/nasab', label: { ar: 'النسب', en: 'Lineage' }, purpose: { ar: 'تتبّع سلاسل الآباء وقارن أنساب عدة أشخاص', en: 'Trace paternal lines and compare several people’s ancestry' } },
    ] },
  ] },
  { href: '/sources', label: { ar: 'المصادر', en: 'Sources' }, groups: [{ items: [
    { href: '/sources', label: { ar: 'الكتب', en: 'Books' }, purpose: { ar: 'الكتب التي تُستخرج منها المعلومات، تُقرأ بنصها', en: 'The books the information comes from, readable in full' } },
    { href: '/attributions', label: { ar: 'العزو', en: 'Attributions' }, purpose: { ar: 'مصادر البيانات وتراخيصها', en: 'Where the data comes from and its licences' } },
  ] }] },
  { href: '/quizzes', label: { ar: 'الاختبارات', en: 'Quizzes' }, groups: [] },
];

const owns = (section: NavSection, path: string) => {
  const under = (href: string) => path === href || path.startsWith(`${href}/`);
  return under(section.href) || section.groups.some(group => group.items.some(item => under(item.href)));
};

export function activeSection(path: string): string | undefined {
  return NAV_SECTIONS.find(section => owns(section, path))?.href;
}

function Shelf({ section, language, id, path, onPick }: { section: NavSection; language: Language; id: string; path: string; onPick: () => void }) {
  return (
    <div id={id} className={styles.shelf}>
      {section.groups.map((group, g) => (
        <div key={g} className={styles.shelfGroup}>
          {group.title && <h3>{group.title[language]}</h3>}
          <ul>
            {group.items.map(item => (
              <li key={item.href}>
                <Link href={item.href} onClick={onPick} aria-current={path === item.href ? 'page' : undefined}>
                  <span className={styles.itemLabel}>{item.label[language]}</span>
                  <span className={styles.itemPurpose}>{item.purpose[language]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link href={section.href} className={styles.overview} onClick={onPick}>
        {language === 'ar' ? `كل صفحات ${section.label.ar}` : `All ${section.label.en} pages`}
      </Link>
    </div>
  );
}
function Chapter({ section, language, active, path }: { section: NavSection; language: Language; active: boolean; path: string }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const shelfId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const label = section.label[language];
  if (section.groups.length === 0) {
    return <li className={styles.chapter}><Link href={section.href} aria-current={active ? 'page' : undefined}>{label}</Link></li>;
  }
  const pick = () => { setOpen(false); setDismissed(true); };
  const place = () => {
    const shelf = document.getElementById(shelfId);
    if (!shelf) return;
    shelf.style.translate = '';
    const { left, right } = shelf.getBoundingClientRect();
    const edge = 8;
    const shift = right > innerWidth - edge ? innerWidth - edge - right : left < edge ? edge - left : 0;
    if (shift) shelf.style.translate = `${shift}px 0`;
  };
  return (
    <li
      className={styles.chapter}
      data-open={open || undefined}
      data-dismissed={dismissed || undefined}
      onPointerEnter={place}
      onPointerLeave={event => { setDismissed(false); if (event.pointerType === 'mouse') setOpen(false); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}
      onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); } }}
    >
      <Link href={section.href} aria-current={active ? 'page' : undefined} onClick={pick}>{label}</Link>
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={shelfId}
        aria-label={language === 'ar' ? `صفحات ${label}` : `${label} pages`}
        onClick={() => { place(); setDismissed(false); setOpen(value => !value); }}
      >
        <ChevronDown size={12} aria-hidden />
      </button>
      <Shelf section={section} language={language} id={shelfId} path={path} onPick={pick} />
    </li>
  );
}

export default function NavBar() {
  const { language, languageLoaded, toggleLanguage } = useLanguage() as { language: Language; languageLoaded: boolean; toggleLanguage: () => void };
  const path = usePathname() ?? '/';
  const menuOnly = /^\/quizzes\/party\/[^/]+/.test(path);
  const [menuOpen, setMenuOpen] = useState(false);
  if (!languageLoaded && menuOnly) return null;
  if (!languageLoaded) {
    return (
      <>
        <nav className={styles.bar}><div className={styles.band} /></nav>
        <div className={styles.spacer} />
      </>
    );
  }

  const active = activeSection(path);
  const ar = language === 'ar';

  return (
    <>
      <nav className={menuOnly ? styles.menuOnly : styles.bar} aria-label={ar ? 'الأبواب' : 'Main'} dir={ar ? 'rtl' : 'ltr'}>
        <div className={styles.band}>
          {!menuOnly && <>
          <Link href="/" className={styles.wordmark} onClick={() => setMenuOpen(false)} aria-label={translations[language].appName}><Emblem className={styles.emblem} /><Logo small className={styles.logo} /></Link>
          <ul className={styles.chapters}>
            {NAV_SECTIONS.map(section => (
              <Chapter key={section.href} section={section} language={language} active={section.href === active} path={path} />
            ))}
          </ul>
          </>}
          <div className={styles.actions}>
            {!menuOnly && <>
            <button type="button" className={styles.language} onClick={toggleLanguage} lang={ar ? 'en' : 'ar'} aria-label={ar ? 'Switch to English' : 'التبديل إلى العربية'}>
              {ar ? 'EN' : 'ع'}
            </button>
            <ThemeSwitcher palette="site" />
            </>}
            <button
              type="button"
              className={`${styles.iconButton} ${styles.menuButton}`}
              onClick={() => setMenuOpen(open => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')}
            >
              {menuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className={styles.mobile}>
            {NAV_SECTIONS.map(section => {
              const current = section.href === active;
              if (section.groups.length === 0) {
                return <Link key={section.href} href={section.href} className={styles.mobileChapter} aria-current={current ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{section.label[language]}</Link>;
              }
              return (
                <details key={section.href} open={current} className={styles.mobileSection}>
                  <summary aria-current={current ? 'page' : undefined}>{section.label[language]}</summary>
                  <Shelf section={section} language={language} id={`${section.href}-mobile`} path={path} onPick={() => setMenuOpen(false)} />
                </details>
              );
            })}
          </div>
        )}
      </nav>
      {!menuOnly && <div className={styles.spacer} />}
    </>
  );
}
