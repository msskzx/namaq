import React from 'react';
import Link from 'next/link';
import type { PersonWithTitles } from '@/types/person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignature } from '@fortawesome/free-solid-svg-icons';
import Badge from './Badge';

interface PersonCardProps {
  person: PersonWithTitles;
  language: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, language = 'ar' }) => {
  return (
    <Link href={`/people/${person.slug}`} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faUser} className="text-amber-400 w-5 h-5" />
          <h3 className="text-lg font-semibold text-amber-400 dark:text-amber-400">{person.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {person.titles && person.titles.length > 0 && person.titles.map((title) => (
              <Badge
                key={title.id}
                text={language === 'ar' && title.name ? title.name : title.nameTransliterated || title.name}
                color="indigo"
              />
            ))}
        </div>
        {person.fullName && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200 text-sm mt-1">
            <FontAwesomeIcon icon={faSignature} className="text-indigo-400 w-4 h-4" />
            <span>{person.fullName}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PersonCard; 