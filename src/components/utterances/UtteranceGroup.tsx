'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import type { Utterance } from '@/types/utterance';
import UtteranceCard from './UtteranceCard';

export type UtteranceGroupVariant = 'said' | 'about' | 'here';

interface UtteranceGroupProps {
  utterances: Utterance[] | undefined;
  /** Which heading to use: what a person said, what was said about them, or what was said at a battle or event. */
  variant: UtteranceGroupVariant;
  /** MALE or FEMALE. Arabic has no neutral pronoun, so the heading needs it; English does not use it. */
  sex?: string | null;
}

export default function UtteranceGroup({ utterances, variant, sex }: UtteranceGroupProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!utterances || utterances.length === 0) return null;

  const heading = t.utterances.headings[variant];
  const title = typeof heading === 'string' ? heading : heading[sex === 'FEMALE' ? 'FEMALE' : 'MALE'];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faFeatherPointed} className="w-7 h-7 text-amber-500 ml-2" />
        {title}
      </h2>
      <div className="space-y-4">
        {utterances.map((utterance) => (
          <UtteranceCard key={utterance.id} utterance={utterance} />
        ))}
      </div>
    </div>
  );
}
