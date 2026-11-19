import { View } from 'react-native';
import Reference from '@/ui/Reference';
import { referenceGroups, type QuizSource } from '@shared/quiz/sources';
import type { Palette } from '@/lib/theme';

/**
 * Where a quiz answer comes from, under it once answered (owner, 2026-11-19): one collapsed line for each book, a tap
 * opening the places and words cited (shared/quiz/sources.ts). The website has the same in src/components/quiz/QuizSources.tsx.
 */
export default function QuizSources({ sources, palette }: { sources?: QuizSource[]; palette: Palette }) {
  if (!sources?.length) return null;
  return (
    <View style={{ gap: 8 }}>
      {referenceGroups(sources).map(group => <Reference key={group.title} title={group.title} quotes={group.lines} palette={palette} />)}
    </View>
  );
}
