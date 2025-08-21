"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Surah } from '@/types/quran';
import useSWR from "swr";
import SurahCard from '@/components/quran/SurahCard';
import { fetcher } from '@/lib/swr';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function QuranPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: surahs, error, isLoading } = useSWR<Surah[]>('/api/quran/surahs', fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage title={language === 'ar' ? 'تعذر تحميل السور' : 'Failed to load surahs'} description={String(error)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 dark:bg-indigo-950">
            <FontAwesomeIcon icon={faBook} className="text-amber-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-amber-400">
            {t.motivation.quran.title}
          </h1>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl shadow-lg p-6">
          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {surahs?.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {language === 'ar'
                ? 'مصدر البيانات: قاعدة البيانات المحلية'
                : 'Data source: Local Database'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 