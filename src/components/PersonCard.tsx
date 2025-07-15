import React from 'react';
import Link from 'next/link';
import type { Person } from '@/generated/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignature } from '@fortawesome/free-solid-svg-icons';

interface PersonCardProps {
  person: Pick<Person, 'slug' | 'name' | 'fullName'>;
  language: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <div className="flex items-center gap-3 mb-2">
        <FontAwesomeIcon icon={faUser} className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
        <Link href={`/people/${person.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
          {person.name}
        </Link>
      </div>
      {person.fullName && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
          <FontAwesomeIcon icon={faSignature} className="text-indigo-400 w-4 h-4" />
          <span>{person.fullName}</span>
        </div>
      )}
    </div>
  );
};

export default PersonCard; 