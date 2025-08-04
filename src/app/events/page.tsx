"use client";

import React from "react";
import useSWR from "swr";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import { EventBase } from '@/types/event';
import EventTimeline from "@/components/events/EventTimeline";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function EventsPage() {
  const { language } = useLanguage();
  const { data: events, error, isLoading } = useSWR<EventBase[]>("/api/events", fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-bold mb-6 text-amber-400 text-center">{translations[language].events}</h1>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mb-4">
            {translations[language].eventsLoadError}
          </div>
        )}
        {isLoading || !events ? (
          <LoadingSpinner />
        ) : (
          <EventTimeline events={events} />
        )}
      </div>
    </div>
  );
}

export default EventsPage; 