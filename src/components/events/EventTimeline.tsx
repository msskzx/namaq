'use client';

import React from 'react';
import { compareHijriYear } from '@/lib/hijriYear';
import type { TimelineItem } from '@/lib/timeline';
import EventCard from '@/components/events/EventCard';

interface EventTimelineProps {
  events: TimelineItem[];
}

function EventTimeline({ events }: EventTimelineProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-400"></div>

        {[...events]
          .sort((a, b) => compareHijriYear(a.hijriYear, b.hijriYear))
          .map((event) => (
            <div key={event.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 bg-amber-400 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>

              {/* Content - Clickable Card */}
              <EventCard event={event} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default EventTimeline;
