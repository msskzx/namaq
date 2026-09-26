import React from 'react';
import Link from 'next/link';
import translations from '@/components/language/translations';

interface TitleCardProps {
  title: {
    id: string;
    name: string;
    nameTransliterated: string | null;
    slug: string;
    peopleCount?: number;
  };
  language: string;
  url: string;
}

function TitleCard({ title, language, url }: TitleCardProps) {
  return (
    <Link href={url} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg text-gray-900 dark:text-gray-100">
            {language === 'ar' ? title.name : title.nameTransliterated || title.name}
          </h3>
        </div>
        {title.peopleCount !== undefined && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{translations[language as 'en' | 'ar'].peopleCount(title.peopleCount)}</p>
        )}
      </div>
    </Link>
  );
}

export default TitleCard; 