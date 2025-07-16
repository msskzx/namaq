"use client";

import React from "react";
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import { notFound } from 'next/navigation';
import useSWR from 'swr';
import { useParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then(res => res.ok ? res.json() : null);

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: article, error, isLoading } = useSWR(`/api/articles/${slug}`, fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error || !article) return notFound();

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold mb-4">{language === 'ar' ? article.title : article.titleEn || article.title}</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">{language === 'ar' ? article.summary : article.summaryEn || article.summary}</p>
      <div className="prose dark:prose-invert max-w-none mb-8">
        {language === 'ar' ? article.content : article.contentEn || article.content}
      </div>
      {article.categories && article.categories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">{translations[language].categories}</h2>
          <ul className="flex flex-wrap gap-2">
            {article.categories.map((cat: any) => (
              <li key={cat.id}>
                <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm text-gray-800 dark:text-gray-200">
                  {language === 'ar' ? cat.name : cat.nameEn || cat.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 