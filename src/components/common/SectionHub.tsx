'use client';

import React from 'react';
import ExplorationCard from './ExplorationCard';
import cards from './ExplorationCard.module.css';
import styles from './PaperPage.module.css';
import { useLanguage } from '../language/LanguageContext';
import { NAV_SECTIONS } from './NavBar';

type Language = 'en' | 'ar';

// The hub a navbar section's main link opens: every page on its shelf, as
// cards under the shelf's group titles.
export default function SectionHub({ href }: { href: string }) {
  const { language } = useLanguage() as { language: Language };
  const section = NAV_SECTIONS.find(s => s.href === href)!;
  let number = 0;
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`${styles.page} w-full max-w-5xl mx-auto p-4`}>
      <header className={styles.heading}>
        <h1>{section.label[language]}</h1>
      </header>
      {section.groups.map((group, g) => (
        <section key={g} className="mb-6">
          {group.title && <h2 className="text-xl text-[var(--home-muted)]">{group.title[language]}</h2>}
          <ol className={cards.grid}>
            {group.items.map(item => (
              <li key={item.href}>
                <ExplorationCard url={item.href} title={item.label[language]} desc={item.purpose[language]} number={++number} language={language} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
