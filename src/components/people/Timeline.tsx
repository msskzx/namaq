'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import type { EventWithBattle } from '@/types/event';
import { EventType } from '@/generated/prisma';
import Link from 'next/link';

interface TimelineItemProps {
  event: EventWithBattle;
  language: string;
}

function TimelineItem({ event, language }: TimelineItemProps) {
  return (
    <div className="flex flex-col items-center mx-4 my-4">
      <Link
        href={event.type === EventType.BATTLE ? `/battles/${event.battle?.slug}` : `/events/${event.slug}`}
        className="group my-8 text-center block"
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border px-3 py-2 w-full transition-all duration-200 hover:shadow-md cursor-pointer ${event.type === EventType.BATTLE
            ? 'border-sky-500 dark:border-sky-400 hover:border-sky-600 dark:hover:border-sky-500 hover:bg-sky-100 dark:hover:bg-sky-600'
            : 'border-slate-500 dark:border-slate-400 hover:border-slate-600 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">
            {language === 'ar' ? event.name : event.nameTransliterated}
          </h3>
        </div>
      </Link >

      {/* Dot */}
      < div className="w-4 h-4 bg-amber-600 rounded-full border-2 border-amber-400 shadow" ></div >
      <div className="h-6 w-0.5 bg-amber-400"></div>

      {/* Year */}
      {
        event.hijriYear && (
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-4">
            {event.hijriPeriod}
          </div>
        )
      }
    </div >
  );
}

interface TimelineProps {
  events: EventWithBattle[];
}

export default function Timeline({ events }: TimelineProps) {
  const { language } = useLanguage();

  // Determine number of items per row responsively (hooks must run before any return)
  const [rowSize, setRowSize] = React.useState(5);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 640px)');
    const apply = () => setRowSize(mql.matches ? 2 : 5);
    apply();

    const listener = (e: MediaQueryListEvent) => setRowSize(e.matches ? 2 : 5);

    // Support both modern and legacy MediaQueryList APIs without using any
    type LegacyMediaQueryList = MediaQueryList & {
      addListener: (cb: (e: MediaQueryListEvent) => void) => void;
      removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
    };

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', listener);
    } else if ('addListener' in mql) {
      (mql as LegacyMediaQueryList).addListener(listener);
    }

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', listener);
      } else if ('removeListener' in mql) {
        (mql as LegacyMediaQueryList).removeListener(listener);
      }
    };
  }, []);

  if (!events || events.length === 0) return null;

  const sortedEvents = [...events].sort(
    (a, b) => (a.hijriYear || 0) - (b.hijriYear || 0)
  );

  const rows: EventWithBattle[][] = [];
  for (let i = 0; i < sortedEvents.length; i += rowSize) {
    rows.push(sortedEvents.slice(i, i + rowSize));
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
      {/* Header */}
      <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-200 flex items-center gap-2">
        <FontAwesomeIcon icon={faTimeline} className="w-7 h-7 text-amber-500" />
        {language === 'ar' ? 'الخط الزمني' : 'Timeline'}
      </h2>

      {/* Snake Rows */}
      <div className="flex flex-col items-stretch w-full">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            <div
              className={`flex ${rowIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center w-full justify-between py-2`}
            >
              <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-amber-400 transform -translate-y-1/2 z-0"></div>
              {row.map((event) => (
                <div key={event.id} className="relative w-40 sm:w-52 md:w-60 flex justify-center">
                  <TimelineItem event={event} language={language} />
                </div>
              ))}
            </div>
            {/* Vertical connector to next row */}
            {rowIndex < rows.length - 1 && (
              <div
                className={`absolute ${rowIndex % 2 === 0 ? 'left-0' : 'right-0'} -bottom-42 h-56 w-0.5 bg-amber-400`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}