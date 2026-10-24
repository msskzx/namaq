"use client";

import { Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button type="button" onClick={toggleLanguage} className="inline-flex items-center gap-2 rounded-sm border border-[var(--home-rule)] px-2 py-1 text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]" aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>
      <Languages size={16} aria-hidden />
      <span lang={language === 'en' ? 'ar' : 'en'}>{language === 'en' ? 'ع' : 'EN'}</span>
    </button>
  );
}
