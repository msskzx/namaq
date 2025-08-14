"use client";

import React from "react";
import ArticleDetails from "@/components/articles/ArticleDetails";
import { useLanguage } from "@/components/language/LanguageContext";

export default function SpecialArticleDetailPage() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto bg-white dark:bg-gray-950 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <ArticleDetails />
        <div className="mb-8 mt-10 bg-amber-50 dark:bg-gray-900 border border-amber-300 dark:border-amber-600 rounded-xl p-6 text-center shadow">
          <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">
            {language === 'ar' ? 'قريبًا' : 'Coming Soon'}
          </h2>
          <p className="text-gray-800 dark:text-gray-200">
            {language === 'ar' ? 'يتم تحديث هذا القسم بمحتوى خاص قريبًا. ترقّب المزيد!' : 'This section will be updated with special content soon. Stay tuned!'}
          </p>
        </div>
      </div>
    </div>
  );
}