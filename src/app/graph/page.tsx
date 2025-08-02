'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function GraphPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">
        {language === 'ar' ? 'خريطة العلاقات' : 'Relationship Graph'}
      </h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-8">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">{language === 'ar' ? 'يتم العمل على هذه الميزة حالياً' : 'This feature is currently under development'}</p>
        </div>
      </div>
    </div>
  );
}
