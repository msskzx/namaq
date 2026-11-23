import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * Sayings of one speaker set apart on a softly tinted band at the head of their card, his name once above them in its
 * tone (owner, 2026-11-23: the Prophet's ﷺ words about a companion first, sketch tarajim-feed-card/sketch/traits-dark.png).
 * Edge to edge of its card, ruled under.
 */
export default function SayingBand({ by, tone, palette, children }: { by: string; tone: string; palette: Palette; children: ReactNode }) {
  return (
    <View style={{ backgroundColor: `${tone}14`, borderBottomWidth: 1, borderColor: `${palette.rule}66`, padding: 16, gap: 14 }}>
      <Text style={{ color: tone, fontSize: 15, textAlign: 'right' }}>{by}</Text>
      {children}
    </View>
  );
}
