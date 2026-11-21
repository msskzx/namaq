import { useContext } from 'react';
import Reference from '@/ui/Reference';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { SourceSlotContext } from '@/ui/sourceSlot';
import { referenceGroups, type QuizSource } from '@shared/quiz/sources';
import type { Palette } from '@/lib/theme';

/**
 * Where a quiz answer comes from, under it once answered (owner, 2026-11-19): in a home card its books join the card's
 * source line; on a quiz's own page they are the book line (owner, 2026-11-20), a tap opening the places and words cited
 * (shared/quiz/sources.ts). The website has the same in src/components/quiz/QuizSources.tsx.
 */
export default function QuizSources({ sources, palette }: { sources?: QuizSource[]; palette: Palette }) {
  const inCard = !!useContext(SourceSlotContext);
  if (!sources?.length) return null;
  if (inCard) return <>{referenceGroups(sources).map(group => <Reference key={group.title} title={group.title} quotes={group.lines} palette={palette} />)}</>;
  return <SourceLine sources={sourcesOf(sources)} palette={palette} />;
}
