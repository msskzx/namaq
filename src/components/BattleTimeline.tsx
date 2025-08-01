'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import type { Battle } from '@/types/battle';
import BattleCard from './BattleCard';

interface BattleTimelineProps {
  battles: Battle[];
}

function BattleTimeline({ battles }: BattleTimelineProps) {
  const { language } = useLanguage();

  if (!battles || battles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="font-bold text-2xl mb-6 text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faShield} className="w-6 h-6" />
        {language === 'ar' ? 'المعارك والغزوات' : 'Battles & Expeditions'}
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-400"></div>
        
        {battles
          .sort((a, b) => (a.hijriYear || 0) - (b.hijriYear || 0))
          .map((battle) => (
            <div key={battle.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 bg-amber-400 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
              
              {/* Content - Clickable Card */}
              <BattleCard battle={battle} language={language} url={`/battles/${battle.slug}`} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default BattleTimeline;
