import { View } from 'react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import type { Palette } from '@/lib/theme';

/** How far through the list a pager is: a thin bar under the top bar, with the count in small type under its end. */
export default function PageProgress({ at, count, label, palette }: { at: number; count: number; label: string; palette: Palette }) {
  if (count < 2) return null;
  return (
    <View accessibilityLabel={`${label} ${num(at)} من ${num(count)}`}>
      <View style={{ height: 2, backgroundColor: palette.rule }}>
        <View style={{ height: 2, width: `${(at / count) * 100}%`, alignSelf: 'flex-start', backgroundColor: palette.muted }} />
      </View>
      <Text style={{ alignSelf: 'flex-end', paddingHorizontal: 12, paddingTop: 2, color: palette.muted, fontSize: 11 }}>{num(at)} / {num(count)}</Text>
    </View>
  );
}
