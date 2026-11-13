'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight, BookMarked, ListStart, MessagesSquare, ScrollText, SunMoon, type LucideIcon } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import { useLanguage } from '@/components/language/LanguageContext';
import { QURAN_TOOLS } from '@/lib/navigation';
import styles from './QuranHub.module.css';

type Language = 'en' | 'ar';


const ICONS: Record<string, LucideIcon | typeof TreeIcon> = {
  '/quran/branches': TreeIcon,
  '/quran/compare': ArrowLeftRight,
  '/quran/prophets': ScrollText,
  '/quran/tajwid/tuhfat-al-atfal': BookMarked,
  '/quran/oaths': SunMoon,
  '/quran/iltifat': MessagesSquare,
  '/quran/openings': ListStart,
};

/** The Quran tab, as in the app (owner, 2026-11-13): its tools as tiles, two to a row on a phone. The mushaf has its own tab. */
export default function QuranHub() {
  const { language } = useLanguage() as { language: Language };
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={styles.page}>
      <h1 className="sr-only">{language === 'ar' ? 'القرآن' : 'Quran'}</h1>
      <ul className={styles.grid}>
        {QURAN_TOOLS.map(({ href, label }) => {
          const Icon = ICONS[href];
          return (
            <li key={href}>
              <Link href={href} className={styles.tile}><Icon size={30} strokeWidth={1.75} aria-hidden /><span>{label[language]}</span></Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
