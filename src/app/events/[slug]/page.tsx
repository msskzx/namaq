"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonNameCard from '@/components/PersonNameCard';
import { EventAll as HistoryEvent } from '@/types/event';
import { PersonBase } from "@/types/person";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EventPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];
  const { data: event, error, isLoading } = useSWR<HistoryEvent>(slug ? `/api/events/${slug}` : null, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-900">
              <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-amber-400">
              {event ? (language === 'ar' ? event.name : event.nameTransliterated || event.name) : t.battles.title}
            </h1>
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {t.battles.loadError}
            </div>
          )}
          {event && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-400 p-6 font-geistmono">
              <div className="flex flex-wrap gap-4 mb-6">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-amber-400 w-5 h-5" />
                  <span className="text-gray-800 dark:text-gray-300">
                    {language === 'ar'
                      ? event.location
                      : event.locationTransliterated || event.location || '-'}
                  </span>
                </div>

                {/* Hijri Period */}
                {event.hijriPeriod && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-amber-400 w-5 h-5" />
                    <span className="text-gray-800 dark:text-gray-300">{event.hijriPeriod}</span>
                  </div>
                )}
              </div>

              {event.description && (
                <div className="mb-2">
                  <span className="text-gray-800 dark:text-gray-200">{language === 'ar' ? event.description : event.descriptionTransliterated}</span>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 mt-8">
                {language === 'ar' ? 'الشخصيات' : 'People Involved'}
              </h2>
              {event.people && event.people.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.people.map((person: PersonBase) => (
                    <PersonNameCard 
                      key={person.id} 
                      person={person} 
                      language={language} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  {language === 'ar' ? 'لا يوجد مشاركون في هذه المعركة.' : 'No people involved in this event.'}
                </div>
              )}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default EventPage; 