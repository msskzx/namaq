"use client";

import React from "react";
import useSWR from "swr";
import ArticleCard from '../../components/ArticleCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ArticlesPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: articles, error, isLoading } = useSWR<any[]>("/api/articles", fetcher);

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold mb-6">{translations[language].articles}</h1>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-center mb-4">
          {translations[language].articlesLoadError}
        </div>
      )}
      {isLoading || !articles ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default ArticlesPage; 