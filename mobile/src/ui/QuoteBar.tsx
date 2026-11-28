import type { ReactNode } from 'react';
import { View } from 'react-native';
import EdgeBar from '@/ui/EdgeBar';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export type QuotePiece = { text: string; name?: boolean; mark?: boolean };

export default function QuoteBar({ pieces = [], by, tone, palette, size = 18, marked = false, quoted = false, foot, lines, children }: {
  pieces?: QuotePiece[]; by?: string; tone?: string; palette: Palette; size?: number;
  marked?: boolean; quoted?: boolean; foot?: ReactNode;
  lines?: number;
  children?: ReactNode }) {
  const body = <>
    {by ? <Text style={{ color: tone ?? palette.muted, fontSize: 14, textAlign: 'right' }}>{by}</Text> : null}
    {children ?? <Text numberOfLines={lines} style={{ color: marked ? palette.green : palette.ink, fontSize: size, lineHeight: size * 1.7, textAlign: 'right' }}>
      {quoted ? <Text style={{ color: tone ?? palette.accent }}>« </Text> : null}
      {pieces.map((piece, i) => (piece.name ? <Text key={i} style={{ color: palette.accent }}>{piece.text}</Text>
        : piece.mark ? <Text key={i} style={{ backgroundColor: `${palette.accent}38` }}>{piece.text}</Text> : piece.text))}
      {quoted ? <Text style={{ color: tone ?? palette.accent }}> »</Text> : null}
    </Text>}
    {foot}
  </>;
  return quoted ? <View style={{ gap: 2 }}>{body}</View> : <EdgeBar tone={tone ?? palette.accent}>{body}</EdgeBar>;
}
