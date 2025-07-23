'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import type { BattleParticipation } from '@/types/battle';
import Link from 'next/link';

interface TimelineItemProps {
  participation: BattleParticipation;
  language: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ participation, language }) => {
  const battleName = language === 'ar' ? participation.battle.name : participation.battle.nameEn || participation.battle.name;
  const hijriYearText = language === 'ar' ? 'هـ' : 'AH';

  return (
    <div className="relative flex flex-col items-center mx-8 first:ml-0 last:mr-0 min-w-[120px]"> {/* Added min-w to ensure spacing */}
      {/* Battle Name Link (above dot) */}
      <Link
        href={`/battles/${participation.battle.slug}`}
        className="group mt-4 mb-8 text-center block" 
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2
                    min-w-max transition-all duration-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500
                    hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100
                       group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap">
            {battleName}
          </h3>
        </div>
      </Link>

      {/* Timeline dot */}
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-600 rounded-full z-10 border-2 border-amber-400 shadow"></div>

      {/* Year below dot */}
      {participation.battle.hijri_year && (
        <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
          {participation.battle.hijri_year} {hijriYearText}
        </div>
      )}
    </div>
  );
};

// --- BattleTimeline Component ---
interface TimelineProps {
  participations: BattleParticipation[];
}

const Timeline: React.FC<TimelineProps> = ({ participations }) => {
  const { language } = useLanguage();

  if (!participations || participations.length === 0) {
    return null;
  }

  // Sort participations by Hijri year to ensure chronological order
  const sortedParticipations = [...participations].sort(
    (a, b) => (a.battle.hijri_year || 0) - (b.battle.hijri_year || 0)
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
      {/* Timeline Header */}
      <div className="font-bold text-xl mb-6 text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faTimeline} className="w-5 h-5" />
        {language === 'ar' ? 'الخط الزمني' : 'Timeline'}
      </div>

      {/* Scrollable Timeline Container */}
      <div className="relative overflow-x-auto pb-4 custom-scrollbar"> {/* Added custom-scrollbar class for styling */}
        <div className="flex items-center min-w-max px-4 h-24 relative"> {/* Increased height for better spacing */}
          {/* Main Timeline Line */}
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-amber-400 transform -translate-y-1/2 z-0"></div>

          {/* Render Timeline Items */}
          {sortedParticipations.map((participation) => (
            <TimelineItem
              key={participation.battle.id}
              participation={participation}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
