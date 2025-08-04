"use client";

import React from 'react';
import { useLanguage } from '../LanguageContext';
import translations from '../translations';

const getLinkGroups = (language: 'en' | 'ar') => ({
  arabic: {
    title: translations[language].arabic,
    links: [
      { href: '/arabic', label: translations[language].arabic },
      { href: '/quran', label: translations[language].quran },
      { href: '/hadith', label: translations[language].hadith },
      { href: '/poems', label: translations[language].poems },
    ]
  },
  battles: {
    title: translations[language].battles.title,
    links: [
      { href: '/battles', label: translations[language].battles.title },
      { href: '/events', label: translations[language].events },
    ]
  },
  people: {
    title: translations[language].people,
    links: [
      { href: '/people/prophet-muhammad', label: translations[language].prophet },
      { href: '/people?title=companion', label: translations[language].companions },
      { href: '/people', label: translations[language].people },
      { href: '/titles', label: translations[language].titles },
    ]
  },
  specials: {
    title: language === 'ar' ? 'مقالات مميزة' : 'Special Articles',
    links: [
      { href: '/specials', label: language === 'ar' ? 'مقالات مميزة' : 'Special Articles' },
      { href: '/articles', label: translations[language].articles },
      { href: '/categories', label: translations[language].categories },
    ]
  },
});

function Footer() {
  const { language } = useLanguage();
  const currentLanguage = language || 'ar';
  const isRTL = currentLanguage === 'ar';
  const linkGroups = getLinkGroups(currentLanguage as 'en' | 'ar');
  
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-950 text-amber-600 dark:text-amber-400 border-t-2 border-amber-400">
      <div className="container mx-auto px-4 py-8">
        {/* Main content with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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
                  &copy; {new Date().getFullYear()} Namaq. {currentLanguage === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
                </div>
              </div>
            </div>
            
            <div className="text-sm opacity-80">
              <div className="mt-2">
                <a 
                  href="/privacy" 
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {currentLanguage === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 