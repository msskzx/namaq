'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import type { EventWithBattle } from '@/types/event';
import { EventType } from '@/generated/prisma';
import Link from 'next/link';

interface TimelineItemProps {
  event: EventWithBattle;
  language: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, language }) => {

  return (
    <div className="relative flex flex-col items-center mx-8 first:ml-0 last:mr-0 min-w-[120px]"> {/* Added min-w to ensure spacing */}
      <Link
        href={event.type === EventType.BATTLE ? `/battles/${event.battle?.slug}` : `/events/${event.slug}`}
        className="group mt-4 mb-8 text-center block" 
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-amber-500 dark:border-amber-400 px-3 py-2
                    min-w-max transition-all duration-200 hover:shadow-md hover:border-amber-600 dark:hover:border-amber-500
                    hover:bg-amber-100 dark:hover:bg-amber-600 cursor-pointer">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors whitespace-nowrap">
            {language === 'ar' ? event.name : event.nameTransliterated}
          </h3>
        </div>
      </Link>

      {/* Timeline dot */}
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-600 rounded-full z-10 border-2 border-amber-400 shadow"></div>

      {/* Year below dot */}
      {event.hijriYear && (
        <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
          {event.hijriPeriod}
        </div>
      )}
    </div>
  );
};

// --- BattleTimeline Component ---
interface TimelineProps {
  events: EventWithBattle[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const { language } = useLanguage();

  if (!events || events.length === 0) {
    return null;
  }

  // Sort participations by Hijri year to ensure chronological order
  const sortedEvents = [...events].sort(
    (a, b) => (a.hijriYear || 0) - (b.hijriYear || 0)
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
      {/* Timeline Header */}
      <div className="font-bold text-xl mb-6 text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faTimeline} className="w-5 h-5" />
        {language === 'ar' ? 'الخط الزمني' : 'Timeline'}
      </div>

      {/* Scrollable Timeline Container */}
      <div className="relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 dark:scrollbar-track-gray-700"> {/* Added custom-scrollbar class for styling */}
        <div className="flex items-center min-w-max px-4 h-24 relative"> {/* Increased height for better spacing */}
          {/* Main Timeline Line */}
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-amber-400 transform -translate-y-1/2 z-0"></div>

          {/* Render Timeline Items */}
          {sortedEvents.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
