"use client";

import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';

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
    <footer className="w-full bg-gray-50 dark:bg-black text-amber-600 dark:text-amber-400 border-t-2 border-amber-400">
      <div className="container mx-auto px-4 py-8">
        {/* Main content with 4 columns */}
        <div dir={isRTL ? 'rtl' : 'ltr'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {Object.entries(linkGroups).map(([key, group]) => (
            <div key={key} className="space-y-3">
              <h3 className={`text-lg font-semibold mb-3 dark:text-amber-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {group.title}
              </h3>
              <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
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

        {/* Copyright and tagline */}
        <div className="pt-6 border-t border-amber-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-sm opacity-90 text-gray-700 dark:text-gray-200">
                  &copy; {new Date().getFullYear()} {translations[currentLanguage as 'en' | 'ar'].appName}. {currentLanguage === 'ar' ? 'الشيفرة البرمجية مرخّصة برخصة' : 'The code is released under the'}{' '}
                  <a className="underline" href="https://github.com/msskzx/namaq/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT</a>
                  {currentLanguage === 'ar' ? '.' : ' license.'}
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
