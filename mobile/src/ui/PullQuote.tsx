import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * Words set apart in a long read (owner, 2026-11-23: the battle page as an article, sketch tools-design/battles page-v2):
 * large, centred, between «», ruled above and below in `tone` (the Prophet's ﷺ words in amber). Who says them is in the
 * text just before, as the report puts it.
 */
export default function PullQuote({ text, tone, palette }: { text: string; tone?: string; palette: Palette }) {
  const color = tone ?? palette.amber;
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: color, paddingVertical: 12, paddingHorizontal: 6 }}>
      <Text style={{ color, fontSize: 24, lineHeight: 40, textAlign: 'center' }}>{`«${text}»`}</Text>
    </View>
  );
}
