"use client";

import { useLanguage } from '@/components/language/LanguageContext';
import useSWR from 'swr';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useParams } from 'next/navigation';
import translations from '@/components/language/translations';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types/article';
import EventCard from '@/components/events/EventCard';
import { EventBase } from '@/types/event';

import { fetcher } from '@/lib/swr';

export default function CategoryDetailPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { slug } = useParams<{ slug: string }>();
  const { data: category, error, isLoading } = useSWR(slug ? `/api/categories/${slug}` : null, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : error || !category ? (
          <div className="text-red-600 dark:text-red-400 text-center my-8">
            {t.categoriesLoadError}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-amber-400">{language === 'ar' ? category.name : category.nameTransliterated || category.name}</h1>
            <p className="mb-6">{language === 'ar' ? category.description : category.descriptionTransliterated || category.description}</p>

            {category.events && category.events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-amber-400">{t.events}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.events?.map((event: EventBase) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {category.articles && category.articles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-amber-400">{t.articles}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {category.articles.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} />
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
