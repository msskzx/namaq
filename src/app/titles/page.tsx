"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TitleCard from '@/components/people/TitleCard';
import TitleHero from '@/components/titles/TitleHero';
import { TitleBase } from "@/types/title";
import ErrorMessage from '@/components/common/ErrorMessage';

import { fetcher } from '@/lib/swr';

export default function TitlesPage() {
  const { language } = useLanguage();
  const { data: titles, error, isLoading } = useSWR("/api/titles", fetcher);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <TitleHero />

        <div className="mt-16">
          {error && <ErrorMessage title={language === 'ar' ? 'تعذر تحميل الألقاب.' : 'Failed to load titles.'} />}
          {isLoading || !titles ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.isArray(titles) && titles.length > 0 ? (
                titles.map((title: TitleBase) => (
                  <TitleCard key={title.slug} title={title} language={language} url={`/titles/${title.slug}`} />
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