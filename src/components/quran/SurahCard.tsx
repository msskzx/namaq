import { Surah } from '@/types/quran';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';

function SurahCard({ surah }: { surah: Surah }) {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <Link 
      key={surah.number} 
      href={`/quran/pages/${surah.page}`}
      className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Surah number */}
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
              {surah.number}
            </span>
          </div>
          
          {/* Surah info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1 truncate">
              {surah.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {surah.nameTransliterated}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {surah.nameTranslated}
            </p>
          </div>
        </div>
        
        {/* Arrow icon */}
        <FontAwesomeIcon 
          icon={faArrowRight} 
          className="text-gray-400 group-hover:text-amber-400 transition-colors duration-200 w-4 h-4" 
        />
      </div>
      
      {/* Additional info */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>{t.ayahs}: {surah.numberOfAyat}</span>
          <span className="capitalize">{surah.revelationType}</span>
        </div>
      </div>
    </Link>
  );
}

export default SurahCard;
