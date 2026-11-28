import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';
import type { DifferenceSide, DifferenceWords as Words } from '@shared/quran/mutashabih/types';

function Side({ side }: { side: DifferenceSide }) {
  if (!side.words.length) return <Text>∅</Text>;
  return <Text><Text style={{ fontFamily: QURAN_FONT }}>{side.words.join(' ')}</Text>{side.more ? ' …' : ''}</Text>;
}

export default function DifferenceWords({ words, color, fontSize }: { words: Words; color: string; fontSize: number }) {
  return <Text style={{ color, fontSize, flexShrink: 1, textAlign: 'right' }}><Side side={words.a} /> / <Side side={words.b} /></Text>;
}
