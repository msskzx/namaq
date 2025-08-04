import React from 'react';
import Link from 'next/link';
import type { EventBase } from '@/types/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faShieldAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import type { Battle } from '@/types/battle';

interface EventCardProps {
  event: EventBase | Battle;
}

function EventCard({ event }: EventCardProps) {
  const { language } = useLanguage();
  return (
   <Link 
      href={'type' in event ? `/events/${event.slug}` : `/battles/${event.slug}`}
      className="ml-16 w-full block group"
    >
   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 w-full transition-all duration-200 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
     <div className="flex items-center justify-between mb-2">
       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
         <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-amber-500 dark:text-amber-400" />
         {language === 'ar' ? event.name : event.nameTransliterated || event.name}
       </h3>
       {event.hijriYear && (
         <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
           <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
           <span>{event.hijriYear} {language === 'ar' ? 'هـ' : 'AH'}</span>
         </div>
       )}
     </div>
     
     {event.location && (
       <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
         <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5 text-indigo-400" />
         <span className="font-medium">{language === 'ar' ? 'الموقع:' : 'Location:'}</span> 
         {event.location}
       </div>
     )}
   </div>
 </Link>
  );
};

export default EventCard; 