"use client";

import React from "react";
import useSWR from "swr";
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import type { Battle } from "@/types/battle";
import BattleCard from '@/components/BattleCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BattlesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battles, error, isLoading } = useSWR<Battle[]>("/api/battles", fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">
          {t.battles.title}
        </h1>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mb-4">
            {t.battles.loadError}
          </div>
        )}
        {isLoading || !battles ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {Array.isArray(battles) && battles.length > 0 ? (
              battles.map((battle) => (
                <BattleCard key={battle.id} battle={battle} language={language} url={`/battles/${battle.slug}`} />
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                {t.battles.loadError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BattlesPage; 