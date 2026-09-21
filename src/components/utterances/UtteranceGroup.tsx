'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import Pagination from '@/components/common/Pagination';
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
  pageSize?: number;
}

export default function UtteranceGroup({ utterances, variant, sex, pageSize = 5 }: UtteranceGroupProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [page, setPage] = useState(1);

  const count = utterances?.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / pageSize));

  // A shorter list can leave the reader on a page that no longer exists, for
  // instance when the profile's utterances arrive after an empty first render.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (!utterances || utterances.length === 0) return null;

  const heading = t.utterances.headings[variant];
  const title = typeof heading === 'string' ? heading : heading[sex === 'FEMALE' ? 'FEMALE' : 'MALE'];

  const first = (page - 1) * pageSize;
  const shown = utterances.slice(first, first + pageSize);

  return (
    <div className="bg-black border border-white/10 rounded-lg p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faFeatherPointed} className="w-7 h-7 text-amber-500 ml-2" />
        {title}
      </h2>
      <div className="space-y-4">
        {shown.map((utterance) => (
          <UtteranceCard key={utterance.id} utterance={utterance} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} showSelect />
    </div>
  );
}
