import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';
import type { DifferenceSide, DifferenceWords as Words } from '@shared/quran/mutashabih/types';

/** First piece of the Quran text module: page words shown inline (the copied-ayah level), here the words two ayat differ by, «a / b». */
function Side({ side }: { side: DifferenceSide }) {
  if (!side.words.length) return <Text>∅</Text>;
  return <Text><Text style={{ fontFamily: QURAN_FONT }}>{side.words.join(' ')}</Text>{side.more ? ' …' : ''}</Text>;
}

export default function DifferenceWords({ words, color, fontSize }: { words: Words; color: string; fontSize: number }) {
  return <Text style={{ color, fontSize, flexShrink: 1, textAlign: 'right' }}><Side side={words.a} /> / <Side side={words.b} /></Text>;
}
