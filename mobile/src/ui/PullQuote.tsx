import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export default function PullQuote({ text, tone, palette }: { text: string; tone?: string; palette: Palette }) {
  const color = tone ?? palette.amber;
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: color, paddingVertical: 12, paddingHorizontal: 6 }}>
      <Text style={{ color, fontSize: 24, lineHeight: 40, textAlign: 'center' }}>{`«${text}»`}</Text>
    </View>
  );
}
