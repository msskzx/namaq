import { View } from 'react-native';
import type { Palette } from '@/lib/theme';

export default function SplitBar({ first, second, palette }: { first?: number; second?: number; palette: Palette }) {
  const total = (first ?? 0) + (second ?? 0) || 1;
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 3, height: 10 }}>
      {first ? <View style={{ flex: first / total, backgroundColor: palette.accent, borderRadius: 5 }} /> : null}
      {second ? <View style={{ flex: second / total, backgroundColor: palette.rule, borderRadius: 5 }} /> : null}
    </View>
  );
}
