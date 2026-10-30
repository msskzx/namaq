"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';
import Emblem from './Emblem';
import { NAV_SECTIONS } from '@/lib/navigation';
function Footer() {
  const { language, languageLoaded } = useLanguage();
  const currentLanguage = languageLoaded ? language : 'ar';
  const ar = currentLanguage === 'ar';

  return (
    <footer className="hidden md:block w-full bg-[var(--home-paper)] text-[var(--home-ink)] border-t border-[var(--home-rule)]">
      <div dir={ar ? 'rtl' : 'ltr'} className="w-full max-w-[var(--home-width)] mx-auto px-[var(--home-gutter)] py-6 md:py-8 text-start">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10 mb-6">
          <Link href="/" aria-label={translations[currentLanguage].appName} className="shrink-0 self-start md:self-center">
            <Emblem className="h-12 w-auto" />
          </Link>
          <nav aria-label={ar ? 'الأبواب' : 'Sections'}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 md:flex md:flex-wrap md:gap-x-8">
              {NAV_SECTIONS.map(section => (
                <li key={section.href}>
                  <Link href={section.href} className="text-lg text-[var(--home-ink)] hover:text-[var(--home-accent)] transition-colors">
                    {section.label[currentLanguage]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="pt-4 border-t border-[var(--home-rule)] flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--home-muted)]">
          <span>&copy; {new Date().getFullYear()} {translations[currentLanguage].appName}</span>
          <Link href="/about" className="hover:text-[var(--home-accent)] transition-colors">{translations[currentLanguage].about}</Link>
          <Link href="/privacy" className="hover:text-[var(--home-accent)] transition-colors">{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
