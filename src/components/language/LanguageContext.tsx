"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  languageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function readStoredLanguage(): Language | undefined {
  if (typeof window === 'undefined') return undefined;

  const cookieConsent = localStorage.getItem('cookie-consent');
  const savedLanguage = cookieConsent === 'accepted'
    ? (Cookies.get('language') as Language)
    : (localStorage.getItem('language') as Language);

  return savedLanguage === 'en' || savedLanguage === 'ar' ? savedLanguage : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => readStoredLanguage() ?? 'ar');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    setLanguageLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const cookieConsent = localStorage.getItem('cookie-consent');
    
    if (cookieConsent === 'accepted') {
      // Save to cookies when consent is given
      Cookies.set('language', newLanguage, { expires: 365 });
    } else {
      // Save to localStorage as fallback
      localStorage.setItem('language', newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, languageLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
} 