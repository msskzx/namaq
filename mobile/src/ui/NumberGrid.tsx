import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';

const PER_ROW = 6;

export default function NumberGrid({ numbers, onOpen, label, tone, palette }: {
  numbers: number[]; onOpen: (n: number) => void; label: (n: number) => string; tone?: string; palette: Palette;
}) {
  const colour = tone ?? palette.rule;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 }}>
      {numbers.map(n => (
        <View key={n} style={{ width: `${100 / PER_ROW}%`, padding: 3 }}>
          <Tap onPress={() => onOpen(n)} accessibilityRole="link" accessibilityLabel={label(n)}
            style={({ pressed }) => ({ aspectRatio: 1, borderRadius: 999, borderWidth: 1, borderColor: colour, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
            <Text style={{ color: tone ?? palette.ink, fontSize: 16 }}>{num(n)}</Text>
          </Tap>
        </View>
      ))}
    </View>
  );
}
