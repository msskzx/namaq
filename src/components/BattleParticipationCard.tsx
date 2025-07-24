import React from 'react';
import Link from 'next/link';
import type { BattleParticipation } from '@/types/battle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface BattleParticipationCardProps {
  participation: BattleParticipation;
  language: string;
  url: string;
}

const BattleParticipationCard: React.FC<BattleParticipationCardProps> = ({participation, language, url }) => {
  return (
   <Link 
   href={url}
   className="ml-16 w-full block group"
 >
   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 w-full transition-all duration-200 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
     <div className="flex items-center justify-between mb-2">
       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
         {language === 'ar' ? participation.battle.name : participation.battle.nameEn || participation.battle.name}
       </h3>
       {participation.battle.hijri_year && (
         <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
           <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
           <span>{participation.battle.hijri_year} {language === 'ar' ? 'هـ' : 'AH'}</span>
         </div>
       )}
     </div>
     
     {participation.battle.location && (
       <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
         <span className="font-medium">{language === 'ar' ? 'الموقع:' : 'Location:'}</span> 
         {language === 'ar' ? participation.battle.location : participation.battle.locationEn || participation.battle.location}
       </div>
     )}
     
     { participation && participation.status && participation.status.length > 0 && (
       <div className="flex flex-wrap gap-1 mt-2">
         {participation.status.map((status, statusIndex) => (
           <span 
             key={statusIndex}
             className={`px-2 py-1 text-xs rounded-full font-medium ${
               status === 'MARTYRED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
               status === 'INJURED' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
               status === 'CAPTURED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
               status === 'ABSENT_EXCUSED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
               'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
             }`}
           >
             {language === 'ar' ? (
               status === 'MARTYRED' ? 'استشهد' :
               status === 'INJURED' ? 'جُرح' :
               status === 'CAPTURED' ? 'أُسر' :
               status === 'ABSENT_EXCUSED' ? 'غائب بعذر' :
               status
             ) : (
               status === 'MARTYRED' ? 'Martyred' :
               status === 'INJURED' ? 'Injured' :
               status === 'CAPTURED' ? 'Captured' :
               status === 'ABSENT_EXCUSED' ? 'Absent (Excused)' :
               status
             )}
           </span>
         ))}
       </div>
     )} 

   </div>
 </Link>
  );
};

export default BattleParticipationCard; 