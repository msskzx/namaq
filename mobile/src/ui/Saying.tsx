import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * Words someone says, with who says them on a muted line before them (owner 2026-11-20: «قال فلان:» first, as the hadith
 * and the sira put the speaker). `by` left out draws the words alone (the author's own).
 */
export default function Saying({ by, palette, size = 14, center = false, children }: { by?: string; palette: Palette;
  /** The sayer's line size: a feed card's or sheet's bigger words take a bigger line. */
  size?: number;
  /** Centred under each other, as in a «مشاهد» scene. */
  center?: boolean; children: React.ReactNode }) {
  return (
    <View style={{ gap: 2, alignItems: center ? 'center' : undefined }}>
      {by ? <Text style={{ color: palette.muted, fontSize: size, textAlign: center ? 'center' : 'right' }}>{by}</Text> : null}
      {children}
    </View>
  );
}
