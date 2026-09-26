"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TitleCard from '@/components/people/TitleCard';
import { TitleBase } from "@/types/title";
import ErrorMessage from '@/components/common/ErrorMessage';

import translations from '@/components/language/translations';
import { fetcher } from '@/lib/swr';

export default function TitlesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: titles, error, isLoading } = useSWR("/api/titles", fetcher);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl text-gray-900 dark:text-gray-100">{t.titles}</h1>

        <div>
          {error && <ErrorMessage title={language === 'ar' ? 'تعذر تحميل الألقاب.' : 'Failed to load titles.'} />}
          {isLoading || !titles ? (
            <LoadingSpinner fill />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.isArray(titles) && titles.length > 0 ? (
                titles.map((title: TitleBase) => (
                  <TitleCard key={title.slug} title={title} language={language} url={`/people?title=${title.slug}`} />
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500 font-arabic">
                  {language === 'ar' ? 'لا توجد ألقاب.' : 'No titles found.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 