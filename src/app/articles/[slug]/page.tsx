"use client";

import React from "react";
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import useSWR from 'swr';
import { useParams } from "next/navigation";
import Badge from '@/components/Badge';
import { CategoryBase } from '@/types/category';

const fetcher = (url: string) => fetch(url).then(res => res.ok ? res.json() : null);

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: article, error, isLoading } = useSWR(`/api/articles/${slug}`, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : error || !article ? (
          <div className="text-red-600 dark:text-red-400 text-center my-8">
            {translations[language].articlesLoadError}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-amber-400">{language === 'ar' ? article.title : article.titleEn || article.title}</h1>
            {article.categories && article.categories.length > 0 && (
              <div className="mb-4">
                <ul className="flex flex-wrap gap-2">
                  {article.categories.map((cat: CategoryBase) => (
                    <li key={cat.id}>
                      <Badge
                        href={`/categories/${cat.slug}`}
                        text={language === 'ar' ? cat.name : cat.nameTransliterated || cat.name}
                        color="blue"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mb-4 text-gray-900 dark:text-gray-200">{language === 'ar' ? article.summary : article.summaryEn || article.summary}</p>
            <div className="prose dark:prose-invert max-w-none mb-8 text-gray-900 dark:text-gray-200">
              {language === 'ar' ? article.content : article.contentEn || article.content}
            </div>
          </>
        )}
      </div>
    </div>
  );
}