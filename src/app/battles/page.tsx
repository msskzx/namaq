"use client";

import React from "react";
import useSWR from "swr";
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import type { Battle } from "@/types/battle";
import BattleCard from '@/components/BattleCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BattlesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battles, error, isLoading } = useSWR<Battle[]>("/api/battles", fetcher);

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t.battles.title}
      </h1>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-center mb-4">
          {t.battles.loadError}
        </div>
      )}
      {isLoading || !battles ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {Array.isArray(battles) && battles.length > 0 ? (
            battles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} language={language} />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
              {t.battles.loadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BattlesPage; 