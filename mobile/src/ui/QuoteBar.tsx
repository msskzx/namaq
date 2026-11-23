import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/** A run of a saying's words: `name` lit in the accent (his name), `mark` on a soft band (the words a card picks out). */
export type QuotePiece = { text: string; name?: boolean; mark?: boolean };

/**
 * A saying with a bar down its right (owner, 2026-11-23: the person's card, sketch tarajim-feed-card/sketch design أ),
 * who says it first in words a new reader follows («قال النبي ﷺ:», as the hadith puts the speaker). `pieces` mark the
 * words to light (his name) in the accent; `tone` colours the bar (the Prophet's ﷺ words in amber). `quoted` draws it
 * between «» with no bar, for sayings under one heading of their own (`SayingBand`); `foot` goes under the words (its page).
 */
export default function QuoteBar({ pieces, by, tone, palette, size = 18, marked = false, quoted = false, foot }: {
  pieces: QuotePiece[]; by?: string; tone?: string; palette: Palette; size?: number;
  /** A quiz's answer, once shown: the words in green. */
  marked?: boolean; quoted?: boolean; foot?: ReactNode }) {
  return (
    <View style={{ borderRightWidth: quoted ? 0 : 3, borderColor: tone ?? palette.accent, paddingRight: quoted ? 0 : 12, gap: 2 }}>
      {by ? <Text style={{ color: tone ?? palette.muted, fontSize: 14, textAlign: 'right' }}>{by}</Text> : null}
      <Text style={{ color: marked ? palette.green : palette.ink, fontSize: size, lineHeight: size * 1.7, textAlign: 'right' }}>
        {quoted ? <Text style={{ color: tone ?? palette.accent }}>« </Text> : null}
        {pieces.map((piece, i) => (piece.name ? <Text key={i} style={{ color: palette.accent }}>{piece.text}</Text>
          : piece.mark ? <Text key={i} style={{ backgroundColor: `${palette.accent}38` }}>{piece.text}</Text> : piece.text))}
        {quoted ? <Text style={{ color: tone ?? palette.accent }}> »</Text> : null}
      </Text>
      {foot}
    </View>
  );
}
