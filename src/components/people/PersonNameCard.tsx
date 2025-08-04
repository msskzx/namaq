import React from 'react';
import Link from 'next/link';
import { PersonBase } from '@/types/person';

interface PersonNameCardProps {
  person: PersonBase;
  language: string;
}

function PersonNameCard({ person, language }: PersonNameCardProps) {
  return (
    <Link href={`/people/${person.slug}`} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow hover:shadow-xl hover:scale-105 dark:hover:bg-gray-700 transition-transform duration-200 cursor-pointer text-center">
        <span className="text-lg font-semibold text-gray-800 dark:text-amber-400">
          {language === 'ar' ? person.name : person.nameTransliterated || person.name}
        </span>
      </div>
    </Link>
  );
};

export default PersonNameCard; 