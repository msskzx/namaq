"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import AnalyticsOptOut from './AnalyticsOptOut';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    setShowSettings(false);
    // Enable analytics
    window.gtag = window.gtag || function() {};
  };

  const handleDecline = () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    setShowSettings(false);
    // Disable analytics
    window.gtag = function() {};
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-lg">
      <div className="container mx-auto max-w-6xl">
        {showSettings ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === 'ar' ? 'إعدادات ملفات تعريف الارتباط' : 'Cookie Settings'}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <AnalyticsOptOut />
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'ar' ? 'رفض الكل' : 'Decline All'}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-950 transition-colors"
              >
                {language === 'ar' ? 'قبول الكل' : 'Accept All'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? (
                  <>
                    نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور. 
                    <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                      سياسة الخصوصية
                    </a>
                  </>
                ) : (
                  <>
                    We use cookies to improve your experience and analyze traffic. 
                    <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                      Privacy Policy
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'ar' ? 'رفض' : 'Decline'}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-950 transition-colors"
              >
                {language === 'ar' ? 'قبول' : 'Accept'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent; 