import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * A saying with a bar down its right (owner, 2026-11-23: the person's card, sketch tarajim-feed-card/sketch design أ),
 * who says it first in words a new reader follows («قال النبي ﷺ:», as the hadith puts the speaker). `pieces` mark the
 * words to light (his name) in the accent; `tone` colours the bar (the Prophet's ﷺ words in amber).
 */
export default function QuoteBar({ pieces, by, tone, palette, size = 18, marked = false }: {
  pieces: { text: string; name: boolean }[]; by?: string; tone?: string; palette: Palette; size?: number;
  /** A quiz's answer, once shown: the words in green. */
  marked?: boolean }) {
  return (
    <View style={{ borderRightWidth: 3, borderColor: tone ?? palette.accent, paddingRight: 12, gap: 2 }}>
      {by ? <Text style={{ color: tone ?? palette.muted, fontSize: 14, textAlign: 'right' }}>{by}</Text> : null}
      <Text style={{ color: marked ? palette.green : palette.ink, fontSize: size, lineHeight: size * 1.7, textAlign: 'right' }}>
        {pieces.map((piece, i) => (piece.name ? <Text key={i} style={{ color: palette.accent }}>{piece.text}</Text> : piece.text))}
      </Text>
    </View>
  );
}
