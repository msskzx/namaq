import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * The one "nothing here" line: muted, centred, with room around it. Say what is missing and, when there is one, the way
 * to fill it («احفظ … لتجدها هنا»). A notice that asks for a choice (no tafsir on the phone) is the screen's own text.
 */
export default function Empty({ text, palette }: { text: string; palette: Palette }) {
  return <Text style={{ padding: 24, color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'center' }}>{text}</Text>;
}
