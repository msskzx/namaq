"use client";

import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import Button from '@/components/common/Button';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <Button variant="outline" onClick={toggleLanguage} aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>
      <Globe size={16} aria-hidden />
      <span lang={language === 'en' ? 'ar' : 'en'}>{language === 'en' ? 'ع' : 'EN'}</span>
    </Button>
  );
}
