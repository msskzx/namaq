
"use client";

import React from "react";
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useSWR from 'swr';
import { useParams } from "next/navigation";
import Badge from '@/components/common/Badge';
import { CategoryBase } from '@/types/category';
import { EventBase } from '@/types/event';
import EventCard from '@/components/events/EventCard';
import { fetcher } from '@/lib/swr';
import Image from 'next/image';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];
  const { data: article, error, isLoading } = useSWR(`/api/articles/${slug}`, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error || !article ? (
          <div className="text-red-600 dark:text-red-400 text-center my-8">
            {translations[language].articlesLoadError}
          </div>
        ) : (
          <>
            {/* Article Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">
              <div className="col-span-1 flex flex-col gap-6">
                <h1 className="text-4xl mb-4 text-amber-400">
                  {language === 'ar' ? article.title : article.titleEn || article.title}
                </h1>
                {article.categories && article.categories.length > 0 && (
                  <div className="flex flex-col gap-2">
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
                <p className="mb-4 text-gray-900 dark:text-gray-200 text-2xl/8">{language === 'ar' ? article.summary : article.summaryEn || article.summary}</p>
              </div>
              {article.img && (
                <div className="w-full flex flex-col gap-6">
                  <Image
                    src={article.img}
                    alt={(language === 'ar' ? article.title : article.titleEn) || article.title || 'Article image'}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-xl shadow"
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <p className="text-gray-900 dark:text-gray-200 text-2xl/12 text-justify">{language === 'ar' ? article.content : article.contentEn || article.content}</p>

            {/* Article Events */}
            {article.events && article.events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl text-amber-400">{t.events}</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.events?.map((event: EventBase) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}