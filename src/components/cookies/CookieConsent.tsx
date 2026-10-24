"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import { Check, Settings, X } from 'lucide-react';
import Button from '../common/Button';
import AnalyticsOptOut from '@/components/cookies/AnalyticsOptOut';
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    setShowSettings(false);
    window.gtag = window.gtag || function() {};
  };

  const handleDecline = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    setShowSettings(false);
    window.gtag = function() {};
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="fixed bottom-0 left-0 right-0 bg-[var(--home-paper)] border-t border-[var(--home-rule)] p-4 z-50 shadow-lg">
      <div className="mx-auto max-w-6xl">
        {showSettings ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--home-ink)]">
                {language === 'ar' ? 'إعدادات ملفات تعريف الارتباط' : 'Cookie Settings'}
              </h3>
              <Button variant="ghost" size="icon"
                aria-label={language === 'ar' ? 'إغلاق الإعدادات' : 'Close settings'}
                onClick={() => setShowSettings(false)}
              >
                <X size={16} aria-hidden />
              </Button>
            </div>
            <AnalyticsOptOut />
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDecline}
              >
                <X size={16} aria-hidden />{language === 'ar' ? 'رفض الكل' : 'Decline All'}
              </Button>
              <Button variant="primary"
                onClick={handleAccept}
              >
                <Check size={16} aria-hidden />{language === 'ar' ? 'قبول الكل' : 'Accept All'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-[var(--home-ink)] mb-2">
                {language === 'ar' ? (
                  <>
                    نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور. 
                    <a href="/privacy" className="text-[var(--home-accent)] hover:underline ms-1">
                      سياسة الخصوصية
                    </a>
                  </>
                ) : (
                  <>
                    We use cookies to improve your experience and analyze traffic. 
                    <a href="/privacy" className="text-[var(--home-accent)] hover:underline ms-1">
                      Privacy Policy
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSettings}
              >
                <Settings size={16} aria-hidden />{language === 'ar' ? 'الإعدادات' : 'Settings'}
              </Button>
              <Button
                onClick={handleDecline}
              >
                <X size={16} aria-hidden />{language === 'ar' ? 'رفض' : 'Decline'}
              </Button>
              <Button variant="primary"
                onClick={handleAccept}
              >
                <Check size={16} aria-hidden />{language === 'ar' ? 'قبول' : 'Accept'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent; 