"use client";

import React from 'react';
import useSWR from 'swr';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types/article';
import { fetcher } from '@/lib/swr';
import ErrorMessage from '@/components/common/ErrorMessage';
import NamaqDefinition from '@/components/homepage/NamaqDefinition';
import ArabicHero from '@/components/arabic/ArabicHero';

export default function Arabic() {
  const { data: category, error, isLoading } = useSWR('/api/categories/arabic', fetcher);
  const { language } = useLanguage();
  const t = translations[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto p-4 md:p-8" dir="rtl">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto p-4 md:p-8" dir="rtl">
          <ErrorMessage title={t.loadingError} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <ArabicHero />

        <div className="mt-16">
          <NamaqDefinition />
        </div>

        {/* Navigation Cards Section */}
        <div className="mt-16 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-200 text-center">
            استكشف المحتوى العربي
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quran Card */}
            <a
              href="/quran"
              className="group bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  القرآن الكريم
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  اقرأ وتدبر آيات الذكر الحكيم
                </p>
              </div>
            </a>

            {/* Hadith Card */}
            <a
              href="/hadith"
              className="group bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  الحديث النبوي
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  أحاديث النبي ﷺ وأقواله المأثورة
                </p>
              </div>
            </a>

            {/* Books Card */}
            <a
              href="/books"
              className="group bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.477 5.754 19 7.5 19s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.477 18.247 19 16.5 19c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  المكتبة
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  كتب ومراجع في مختلف العلوم
                </p>
              </div>
            </a>

            {/* Poems Card */}
            <a
              href="/poems"
              className="group bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  الشعر
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  روائع الشعر العربي عبر العصور
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-16">

          {category.articles && category.articles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-200 text-center">
                {t.articles}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.articles.map((article: Article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
