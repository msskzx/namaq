"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import useSWR from "swr";
import LoadingSpinner from "@/components/LoadingSpinner";
import TitleCard from '@/components/TitleCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TitlesPage() {
  const { language } = useLanguage();
  const { data: titles, error, isLoading } = useSWR("/api/titles", fetcher);
  return (
    <div className="min-h-screen bg-indigo-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-amber-400">
          {translations[language].titles}
        </h1>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mb-4">
            {language === 'ar' ? 'تعذر تحميل الألقاب.' : 'Failed to load titles.'}
          </div>
        )}
        {isLoading || !titles ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {Array.isArray(titles) && titles.length > 0 ? (
              titles.map((title: import("@/generated/prisma").Title) => (
                <TitleCard key={title.slug} title={title} language={language} url={`/titles/${title.slug}`} />
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-400 font-arabic">
                {language === 'ar' ? 'لا توجد ألقاب.' : 'No titles found.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 