"use client";

import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';
import WorkInProgressBanner from '../homepage/WorkInProgressBanner';
import Logo from './Logo';

const getLinkGroups = (language: 'en' | 'ar') => ({
  graph: {
    title: translations[language].allGraph,
    links: [
      { href: '/graphs', label: translations[language].allGraph },
    ]
  },
  people: {
    title: translations[language].people,
    links: [
      { href: '/people', label: translations[language].people },
      { href: '/people/prophet-muhammad', label: translations[language].prophet },
      { href: '/titles', label: translations[language].titles },
      { href: '/events', label: translations[language].events },
    ]
  },
  sources: {
    title: translations[language].sources,
    links: [
      { href: '/sources', label: translations[language].sources },
    ]
  },
  about: {
    title: translations[language].appName,
    links: [
      { href: '/about', label: translations[language].about },
      { href: '/privacy', label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
    ]
  },
});

function Footer() {
  const { language } = useLanguage();
  const currentLanguage = language || 'ar';
  const isRTL = currentLanguage === 'ar';
  const linkGroups = getLinkGroups(currentLanguage as 'en' | 'ar');

  return (
    <footer className="w-full bg-[var(--home-paper)] text-[var(--home-ink)] border-t border-[var(--home-rule)]">
      <div className="w-full max-w-[var(--home-width)] mx-auto px-[var(--home-gutter)] py-8">
        <WorkInProgressBanner />
        <div dir={isRTL ? 'rtl' : 'ltr'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {Object.entries(linkGroups).map(([key, group]) => (
            <div key={key} className="space-y-3">
              <h3 className={`text-lg font-semibold mb-3 text-[var(--home-ink)] ${isRTL ? 'text-right' : 'text-left'}`}>
                {key === 'about' ? <><span className="sr-only">{group.title}</span><Logo small className="h-10 w-auto" /></> : group.title}
              </h3>
              <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[var(--home-ink)] hover:text-[var(--home-accent)] transition-colors"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-[var(--home-rule)]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-sm opacity-90 text-[var(--home-ink)]">
                  &copy; {new Date().getFullYear()} {translations[currentLanguage as 'en' | 'ar'].appName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
