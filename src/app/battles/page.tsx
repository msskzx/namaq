"use client";

import React from "react";
import useSWR from "swr";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import type { Battle } from "@/types/battle";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EventTimeline from "@/components/events/EventTimeline";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function BattlesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battles, error, isLoading } = useSWR<Battle[]>("/api/battles", fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mb-4">
            {t.battles.loadError}
          </div>
        )}
        {isLoading || !battles ? (
          <LoadingSpinner />
        ) : (
          <EventTimeline events={battles} />
        )}
      </div>
    </div>
  );
}

export default BattlesPage; 