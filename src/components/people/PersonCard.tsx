import React from 'react';
import Link from 'next/link';
import type { PersonWithTitles } from '@/types/person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignature } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';

interface PersonCardProps {
  person: PersonWithTitles;
  language: string;
}

function PersonCard({ person, language = 'ar' }: PersonCardProps) {
  if (!person) {
    return null;
  }
  return (
    <Link href={`/people/${person.slug}`} className="block h-full">
      <div className="bg-white dark:bg-gray-900 w-full h-full flex flex-col border-l-4 border-amber-400 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faUser} className="text-amber-400 w-5 h-5" />
          <h2 className="text-2xl text-gray-900 dark:text-gray-200">{person.name}</h2>
        </div>
        <div className="flex-1 flex flex-wrap gap-2 mt-2">
          {person.titles && person.titles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {person.titles.map((title) => (
                <Badge key={title.id} text={language === 'ar' && title.name ? title.name : title.nameTransliterated || title.name} color="indigo" />
              ))}
            </div>
          )}
        </div>
        {person.fullName && (
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-300 text-sm mt-4">
            <FontAwesomeIcon icon={faSignature} className="text-indigo-400 w-4 h-4" />
            <span>{person.fullName}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PersonCard; 