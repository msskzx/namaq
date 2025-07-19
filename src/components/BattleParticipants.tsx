import React from 'react';

interface Participation {
  person: {
    slug: string;
    name: string;
    nameAr?: string;
  };
}

interface BattleParticipantsProps {
  participations: Participation[];
  language: string;
}

const BattleParticipants: React.FC<BattleParticipantsProps> = ({ participations, language }) => {
  if (!participations || participations.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="font-semibold mb-2">{language === 'ar' ? 'المشاركون' : 'Participants'}:</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {participations.map((p) => (
          <a
            key={p.person.slug}
            href={`/people/${p.person.slug}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow border border-indigo-100 dark:border-indigo-950 p-4 hover:shadow-lg transition-all duration-200"
          >
            <span className="text-indigo-950 dark:text-indigo-200 font-semibold">
              {language === 'ar' && p.person.nameAr ? p.person.nameAr : p.person.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BattleParticipants; 