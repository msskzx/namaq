"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { Surah } from '@/types/quran';
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function QuranPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: surahs, error, isLoading } = useSWR<Surah[]>('/api/surahs', fetcher);

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
          <div className="text-center text-red-400">
            {error}
          </div>
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
              <Link 
                key={surah.number} 
                href={`/quran/${surah.number}`}
                className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Surah number */}
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                        {surah.number}
                      </span>
                    </div>
                    
                    {/* Surah info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1 truncate">
                        {surah.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {surah.nameTransliterated}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {surah.nameTranslated}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow icon */}
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="text-gray-400 group-hover:text-amber-400 transition-colors duration-200 w-4 h-4" 
                  />
                </div>
                
                {/* Additional info */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>{t.ayahs}: {surah.numberOfAyat}</span>
                    <span className="capitalize">{surah.revelationType}</span>
                  </div>
                </div>
              </Link>
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