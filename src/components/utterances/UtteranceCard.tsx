'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed, faQuoteLeft, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import type { Utterance } from '@/types/utterance';

/** Verse keeps its line breaks; prose is one paragraph. */
function Text({ utterance }: { utterance: Utterance }) {
  if (utterance.kind !== 'POETRY') {
    return (
      <p className="font-arabic text-xl/9 text-gray-900 dark:text-gray-100" dir="rtl">
        {utterance.textArabic}
      </p>
    );
  }

  return (
    <div className="font-arabic text-xl/9 text-gray-900 dark:text-gray-100 space-y-1" dir="rtl">
      {utterance.textArabic.split('\n').map((line, index) => (
        <div key={index} className="text-center">
          {line}
        </div>
      ))}
    </div>
  );
}

export default function UtteranceCard({ utterance }: { utterance: Utterance }) {
  const { language } = useLanguage();
  const t = translations[language];
  const ar = language === 'ar';

  const speaker = utterance.speaker
    ? ar
      ? utterance.speaker.name
      : utterance.speaker.nameTransliterated || utterance.speaker.name
    : utterance.speakerName;

  const where = utterance.event ?? utterance.battle;
  const wherePath = utterance.event ? 'events' : 'battles';

  return (
    <article className="bg-black border border-white/10 rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <FontAwesomeIcon
          icon={utterance.kind === 'POETRY' ? faFeatherPointed : faQuoteLeft}
          className="w-4 h-4 text-amber-500 dark:text-amber-400"
        />
        <Badge text={t.utterances.kind[utterance.kind]} size="sm" color="amber" />
        {speaker && (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {utterance.speaker ? (
              <Link
                href={`/people/${utterance.speaker.slug}`}
                className="underline decoration-dotted hover:text-amber-600 dark:hover:text-amber-400"
              >
                {speaker}
              </Link>
            ) : (
              speaker
            )}
          </span>
        )}
      </div>

      <Text utterance={utterance} />

      {utterance.occasion && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" dir="rtl">
          {utterance.occasion}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* The source's own verdict on its own report, attributed so that it
            never reads as the app's -- see ADR 0015. */}
        {utterance.grading && (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <FontAwesomeIcon icon={faScaleBalanced} className="w-3.5 h-3.5 shrink-0" />
            <span>
              {t.utterances.grading}: <span dir="rtl">{utterance.grading}</span>
            </span>
          </span>
        )}
        {where && (
          <Badge
            size="sm"
            color="gray"
            href={`/${wherePath}/${where.slug}`}
            text={ar ? where.name : where.nameTransliterated || where.name}
          />
        )}
      </div>
    </article>
  );
}
