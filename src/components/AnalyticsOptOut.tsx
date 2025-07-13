"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AnalyticsOptOut: React.FC = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    setAnalyticsEnabled(consent === 'accepted');
  }, []);

  const handleToggleAnalytics = (enabled: boolean) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {language === 'ar' ? 'إعدادات التحليلات' : 'Analytics Settings'}
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'ar' 
            ? 'يمكنك التحكم في جمع بيانات التحليلات لتحسين تجربتك.'
            : 'You can control the collection of analytics data to improve your experience.'
          }
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'تفعيل التحليلات' : 'Enable Analytics'}
          </span>
          <button
            onClick={() => handleToggleAnalytics(!analyticsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              analyticsEnabled 
                ? 'bg-indigo-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
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