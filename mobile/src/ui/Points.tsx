import { View } from 'react-native';
import type { Palette } from '@/lib/theme';

export default function Points({ items, palette, lineHeight = 30, gap = 10 }: { items: { key: string | number; node: React.ReactNode }[];
  palette: Palette; lineHeight?: number; gap?: number }) {
  return (
    <View style={{ gap }}>
      {items.map(item => (
        <View key={item.key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, marginTop: (lineHeight - 6) / 2, backgroundColor: palette.accent }} />
          <View style={{ flex: 1 }}>{item.node}</View>
        </View>
      ))}
    </View>
  );
}
