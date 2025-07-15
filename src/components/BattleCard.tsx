import React from 'react';
import Link from 'next/link';
import type { Battle } from '@/types/battle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

interface BattleCardProps {
  battle: Battle;
  language: string;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, language }) => {
  return (
    <Link href={`/battles/${battle.slug}`} className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-6 font-geistmono">
      <div className="flex items-center gap-3 mb-2">
        <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
        <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
          {language === 'ar' ? battle.name : battle.nameEn || battle.name}
        </h3>
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
    </Link>
  );
};

export default BattleCard; 