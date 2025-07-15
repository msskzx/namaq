import React from 'react';
import Link from 'next/link';
import type { Battle } from '@/types/battle';

interface BattleCardProps {
  battle: Battle;
  language: string;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, language }) => {
  return (
    <Link href={`/battles/${battle.slug}`} className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-6 font-geistmono">
      <h3 className="text-lg font-bold mb-2 text-indigo-700 dark:text-indigo-300">
        {language === 'ar' ? battle.name : battle.nameEn || battle.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        {language === 'ar' ? battle.location : battle.locationEn || battle.location || '-'}
      </p>
      {battle.hijri_year && (
        <p className="text-xs text-gray-400 mt-2">
          {language === 'ar' ? `السنة الهجرية: ${battle.hijri_year}` : `Hijri Year: ${battle.hijri_year}`}
        </p>
      )}
    </Link>
  );
};

export default BattleCard; 