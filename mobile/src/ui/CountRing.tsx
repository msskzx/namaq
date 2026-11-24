import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Tap } from '@/ui/Tap';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * A counter drawn as a ring that fills as it counts (an open dhikr, owner 2026-11-24): the number in the middle, a word
 * under it, the whole ring one big button. Done, it turns green and takes no more taps.
 */
export default function CountRing({ count, target, shown, done, label, hint, onPress, palette, size = 168 }: {
  count: number; target: number; shown: string; done: boolean; label: string; hint: string; onPress: () => void; palette: Palette; size?: number;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const round = 2 * Math.PI * r;
  const tone = done ? palette.green : palette.accent;
  return (
    <Tap onPress={onPress} disabled={done} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: done }}
      style={({ pressed }) => ({ width: size, height: size, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}>
      <Svg width={size} height={size} style={{ position: 'absolute' }} accessible={false}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={palette.paperDeep} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={tone} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${round * Math.min(1, count / target)} ${round}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: done ? palette.green : palette.ink, fontSize: 40, lineHeight: 52 }}>{shown}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{hint}</Text>
      </View>
    </Tap>
  );
}
