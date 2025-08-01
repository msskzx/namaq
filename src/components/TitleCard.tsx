import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

interface TitleCardProps {
  title: {
    id: string;
    name: string;
    nameTransliterated: string | null;
    slug: string;
  };
  language: string;
  url: string;
}

function TitleCard({ title, language, url }: TitleCardProps) {
  return (
    <Link href={url} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faCrown} className="text-amber-400 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-amber-400">
            {language === 'ar' ? title.name : title.nameTransliterated || title.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default TitleCard; 