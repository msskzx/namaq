import React from 'react';
import Link from 'next/link';
import type { Battle } from '@/types/battle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

interface BattleCardProps {
  battle: Battle;
  language: string;
  url: string;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, language, url }) => {
  return (
    <Link href={url} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-indigo-950 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400 w-5 h-5" />
          <h3 className="text-lg font-semibold text-amber-400 dark:text-amber-400">{battle.name}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faLocationDot} className="text-indigo-500 w-4 h-4" />
          <span>{language === 'ar' ? battle.location : battle.locationEn || battle.location || '-'}</span>
        </div>
        {battle.hijri_year && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <FontAwesomeIcon icon={faCalendarDays} className="text-indigo-500 w-4 h-4" />
            <span>{language === 'ar' ? `السنة الهجرية: ${battle.hijri_year}` : `Hijri Year: ${battle.hijri_year}`}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BattleCard; 