"use client";
import React from "react";
import useSWR from "swr";
import ArticleCard from '../../components/articles/ArticleCard';
import ArticleHero from '../../components/articles/ArticleHero';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { Article } from '@/types/article';
import ErrorMessage from '@/components/common/ErrorMessage';

import { fetcher } from '@/lib/swr';

export default function ArticlesPage() {
  const { language } = useLanguage();
  const { data: articles, error, isLoading } = useSWR<Article[]>("/api/articles", fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <ArticleHero />

        <div className="mt-16">
          {error && <ErrorMessage title={translations[language].articlesLoadError} />}
          {isLoading || !articles ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {Array.isArray(articles) && articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                  {translations[language].articlesNotFound}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}