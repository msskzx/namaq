'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { BATTLE_COUNTS, type Battle } from '@/types/battle';

/**
 * The four counts, and only the ones a source states. A battle where one side
 * was counted and the other was not is the ordinary case, so an unset column is
 * left out rather than shown as zero -- see README, "What is implemented".
 */
export default function BattleCounts({ battle }: { battle: Battle }) {
  const { language } = useLanguage();
  const t = translations[language];

  const counted = BATTLE_COUNTS.filter((key) => typeof battle[key] === 'number');
  if (counted.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="flex items-center gap-2 mb-3 font-semibold text-gray-800 dark:text-gray-300">
        <FontAwesomeIcon icon={faUsers} className="text-amber-400 w-5 h-5" />
        {t.battles.counts.title}
      </h3>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counted.map((key) => (
          <div key={key} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <dt className="text-sm text-gray-600 dark:text-gray-400">{t.battles.counts[key]}</dt>
            <dd className="text-2xl text-gray-900 dark:text-gray-100">{battle[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
