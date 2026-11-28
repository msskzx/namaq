import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export default function Step({ n, palette, children }: { n: number; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: palette.accent, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
        <Text style={{ color: palette.accent, fontSize: 15 }}>{num(n)}</Text>
      </View>
      <View style={{ flex: 1, gap: 4 }}>{children}</View>
    </View>
  );
}
