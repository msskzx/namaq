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
