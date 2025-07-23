import React from 'react';
import Link from 'next/link';
import type { Battle } from '@/types/battle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface BattleCardProps {
  battle: Battle;
  language: string;
  url: string;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, language, url }) => {
  return (
   <Link 
   href={url}
   className="ml-16 w-full block group"
 >
   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 w-full transition-all duration-200 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
     <div className="flex items-center justify-between mb-2">
       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
         {language === 'ar' ? battle.name : battle.nameEn || battle.name}
       </h3>
       {battle.hijri_year && (
         <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
           <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
           <span>{battle.hijri_year} {language === 'ar' ? 'هـ' : 'AH'}</span>
         </div>
       )}
     </div>
     
     {battle.location && (
       <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
         <span className="font-medium">{language === 'ar' ? 'الموقع:' : 'Location:'}</span> 
         {language === 'ar' ? battle.location : battle.locationEn || battle.location}
       </div>
     )}
     
     
   </div>
 </Link>
  );
};

export default BattleCard; 