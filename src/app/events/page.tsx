"use client";

import React from "react";
import useSWR from "swr";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { EventBase } from '@/types/event';
import EventTimeline from "@/components/events/EventTimeline";
import EventHero from "@/components/events/EventHero";
import ErrorMessage from '@/components/common/ErrorMessage';

import { fetcher } from '@/lib/swr';

function EventsPage() {
  const { language } = useLanguage();
  const { data: events, error, isLoading } = useSWR<EventBase[]>("/api/events", fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <EventHero />

        <div className="mt-16">
          {error && <ErrorMessage title={translations[language].eventsLoadError} />}
          {isLoading || !events ? (
            <LoadingSpinner />
          ) : (
            <EventTimeline events={events} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage; 