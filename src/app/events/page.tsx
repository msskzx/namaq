"use client";

import React from "react";
import useSWR from "swr";
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import { Event } from '@/generated/prisma';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EventsPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: events, error, isLoading } = useSWR<Event[]>("/api/events", fetcher);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                {translations[language].eventsNotFound}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 