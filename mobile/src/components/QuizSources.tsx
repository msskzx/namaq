import { useContext } from 'react';
import Reference from '@/ui/Reference';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { SourceSlotContext } from '@/ui/sourceSlot';
import { referenceGroups, type QuizSource } from '@shared/quiz/sources';
import type { Palette } from '@/lib/theme';

export default function QuizSources({ sources, palette }: { sources?: QuizSource[]; palette: Palette }) {
  const inCard = !!useContext(SourceSlotContext);
  if (!sources?.length) return null;
  if (inCard) return <>{referenceGroups(sources).map(group => <Reference key={group.title} title={group.title} quotes={group.lines} places={group.places} editions={group.editions} palette={palette} />)}</>;
  return <SourceLine sources={sourcesOf(sources)} palette={palette} />;
}
