import React from 'react';
import Link from 'next/link';

interface PersonNameCardProps {
  person: {
    slug: string;
    name: string;
    nameEn?: string;
  };
  language: string;
}

const PersonNameCard: React.FC<PersonNameCardProps> = ({ person, language }) => {
  return (
    <Link href={`/people/${person.slug}`} className="block">
      <div className="bg-white dark:bg-gray-900 border border-amber-400 rounded-lg p-4 shadow hover:shadow-xl hover:scale-105 hover:bg-indigo-950 transition-transform duration-200 cursor-pointer text-center">
        <span className="text-lg font-semibold text-amber-400 dark:text-amber-400">
          {language === 'ar' ? person.name : person.nameEn || person.name}
        </span>
      </div>
    </Link>
  );
};

export default PersonNameCard; 