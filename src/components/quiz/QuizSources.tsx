'use client';

import { useContext } from 'react';
import Reference from '@/components/common/Reference';
import SourceLine, { sourcesOf } from '@/components/common/SourceLine';
import { SourceSlotContext } from '@/components/common/sourceSlot';
import { referenceGroups, type QuizSource } from '@shared/quiz/sources';

/**
 * Where a quiz answer comes from, under it once answered (owner, 2026-11-19): in a home card its books join the card's
 * source line; on a quiz's own page they are the book line (owner, 2026-11-20), a click opening the places and words
 * cited (shared/quiz/sources.ts). The phone app has the same in mobile/src/components/QuizSources.tsx.
 */
export default function QuizSources({ sources }: { sources?: QuizSource[] }) {
  const inCard = !!useContext(SourceSlotContext);
  if (!sources?.length) return null;
  if (inCard) return <>{referenceGroups(sources).map(group => <Reference key={group.title} title={group.title} quotes={group.lines} />)}</>;
  return <div dir="rtl" lang="ar"><SourceLine sources={sourcesOf(sources)} /></div>;
}
