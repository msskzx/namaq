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

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Initialize language from storage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const cookieConsent = localStorage.getItem('cookie-consent');
    
    if (cookieConsent === 'accepted') {
      // Use cookies when consent is given
      const savedLanguage = Cookies.get('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    } else {
      // Use localStorage as fallback when cookies not accepted
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    }
    setLanguageLoaded(true);
  }, []);

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
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}; 