"use client";

import React from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types/article';
import { fetcher } from '@/lib/swr';
import ErrorMessage from '@/components/common/ErrorMessage';
import NamaqDefinition from '@/components/homepage/NamaqDefinition';

export default function Arabic() {
  const { data: category, error, isLoading } = useSWR('/api/categories/arabic', fetcher);
  const { language } = useLanguage();
  const t = translations[language];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8" dir="rtl">
        <LoadingSpinner />
      </div>
    );
  }
  if (error || !category) {
    return (
      <div className="container mx-auto p-4 md:p-8" dir="rtl">
        <ErrorMessage title={t.loadingError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      <div className="container mx-auto p-4 md:p-8" dir="rtl">
        <div className="text-center my-12 md:my-16">
          <div className="mt-8 flex flex-row items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mx-auto transition-colors duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl text-blue-600 dark:text-blue-400 tracking-tight arabic-text mb-4">
                اللغة العربية
              </h1>
              <p className="text-2xl text-gray-700 dark:text-gray-200 arabic-text">
                لغة عالمية يتحدث بها أكثر من
              </p>
              <p className="text-5xl md:text-8xl text-blue-600 dark:text-blue-400 my-4 arabic-text">
                422 مليون
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-200 arabic-text mt-6">
                شخص حول العالم
              </p>
            </div>
            <Image
              src={"/mariam_arabic_language.png"}
              alt="arabic-language"
              className="w-1/2 h-auto object-cover rounded-lg"
              width={300}
              height={300}
            />
          </div>
        </div>

        <NamaqDefinition />

        {category.articles && category.articles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-200">{t.articles}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {category.articles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
