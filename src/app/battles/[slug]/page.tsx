"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import type { Battle } from "@/types/battle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BattleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battle, error, isLoading } = useSWR<Battle>(slug ? `/api/battles/${slug}` : null, fetcher);

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-600 dark:text-indigo-400 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
              {battle ? (language === 'ar' ? battle.name : battle.nameEn || battle.name) : t.battles.title}
            </h1>
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {t.battles.loadError}
            </div>
          )}
          {battle && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 font-geistmono">
              <div className="mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-indigo-500 w-5 h-5" />
                <span className="font-semibold">{language === 'ar' ? t.battles.location : t.battles.locationEn}:</span>
                <span>{language === 'ar' ? battle.location : battle.locationEn || battle.location || '-'}</span>
              </div>
              {battle.hijri_year && (
                <div className="mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-indigo-500 w-5 h-5" />
                  <span className="font-semibold">{t.battles.hijriYear}:</span>
                  <span>{battle.hijri_year}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattleDetailPage; 