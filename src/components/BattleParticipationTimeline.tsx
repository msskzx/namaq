'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import type { BattleParticipation } from '@/types/battle';
import BattleParticipationCard from './BattleParticipationCard';

interface BattleParticipationTimelineProps {
  participations: BattleParticipation[];
}

const BattleParticipationTimeline: React.FC<BattleParticipationTimelineProps> = ({ participations }) => {
  const { language } = useLanguage();

  if (!participations || participations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-6 overflow-y-scroll max-h-[700px]">
      <div className="font-bold text-2xl mb-6 text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faShield} className="w-6 h-6" />
        {language === 'ar' ? 'المعارك والغزوات' : 'Battles & Expeditions'}
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-400"></div>
        
        {participations
          .sort((a, b) => (a.battle.hijriYear || 0) - (b.battle.hijriYear || 0))
          .map((participation) => (
            <div key={participation.battle.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 bg-amber-400 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
              
              {/* Content - Clickable Card */}
              <BattleParticipationCard participation={participation} language={language} url={`/battles/${participation.battle.slug}`} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default BattleParticipationTimeline;
