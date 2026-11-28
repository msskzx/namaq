import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export default function Empty({ text, palette }: { text: string; palette: Palette }) {
  return <Text style={{ padding: 24, color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'center' }}>{text}</Text>;
}
