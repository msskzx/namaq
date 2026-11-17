"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import Toggle from '@/components/common/Toggle';

function AnalyticsOptOut() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const consent = localStorage.getItem('cookie-consent');
    setAnalyticsEnabled(consent === 'accepted');
  }, []);

  const handleToggleAnalytics = (enabled: boolean) => {
    if (typeof window === 'undefined') return;
    
    if (enabled) {
      localStorage.setItem('cookie-consent', 'accepted');
      window.gtag = window.gtag || function() {};
    } else {
      localStorage.setItem('cookie-consent', 'declined');
      window.gtag = function() {};
    }
    setAnalyticsEnabled(enabled);
  };

  if (analyticsEnabled === null) return null;

  return (
    <div className="bg-[var(--home-paper-deep)] rounded-lg shadow-lg p-6 mx-auto">
      <h3 className="text-lg font-semibold text-[var(--home-ink)] mb-4">
        {language === 'ar' ? 'إعدادات التحليلات' : 'Analytics Settings'}
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-[var(--home-ink)]">
          {language === 'ar' 
            ? 'يمكنك التحكم في جمع بيانات التحليلات لتحسين تجربتك.'
            : 'You can control the collection of analytics data to improve your experience.'
          }
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--home-ink)]">
            {language === 'ar' ? 'تفعيل التحليلات' : 'Enable Analytics'}
          </span>
          <Toggle checked={analyticsEnabled} label={language === 'ar' ? 'تفعيل التحليلات' : 'Enable Analytics'} onChange={handleToggleAnalytics} />
        </div>
        
        <div className="text-xs text-[var(--home-ink)]">
          {language === 'ar' 
            ? 'التحليلات تساعدنا في تحسين الموقع وتقديم محتوى أفضل.'
            : 'Analytics help us improve the website and provide better content.'
          }
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOptOut; 