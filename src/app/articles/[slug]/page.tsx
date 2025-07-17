"use client";

import React from "react";
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import useSWR from 'swr';
import { useParams } from "next/navigation";
import Badge from '@/components/Badge';

const fetcher = (url: string) => fetch(url).then(res => res.ok ? res.json() : null);

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: article, error, isLoading } = useSWR(`/api/articles/${slug}`, fetcher);

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {isLoading ? (
        <LoadingSpinner />
      ) : error || !article ? (
        <div className="text-red-600 dark:text-red-400 text-center my-8">
          {translations[language].articlesLoadError}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{language === 'ar' ? article.title : article.titleEn || article.title}</h1>
          {article.categories && article.categories.length > 0 && (
            <div className="mb-4">
              <ul className="flex flex-wrap gap-2">
                {article.categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Badge
                      href={`/categories/${cat.slug}`}
                      text={language === 'ar' ? cat.name : cat.nameEn || cat.name}
                      color="bg-blue-300 dark:bg-blue-900"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mb-4 text-gray-600 dark:text-gray-300">{language === 'ar' ? article.summary : article.summaryEn || article.summary}</p>
          <div className="prose dark:prose-invert max-w-none mb-8">
            {language === 'ar' ? article.content : article.contentEn || article.content}
          </div>
        </>
      )}
    </div>
  );
} 