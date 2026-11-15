import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { useCompact } from '@/lib/chrome';
import type { Palette } from '@/lib/theme';

/** The bar and the count under it. */
const HEIGHT = 18;

/**
 * How far through the list a pager is: a thin bar under the top bar, with the count in small type under its end.
 * It slides away with the top bar while the page scrolls down and comes back with it (owner, 2026-11-15: everything hides).
 */
export default function PageProgress({ at, count, label, palette }: { at: number; count: number; label: string; palette: Palette }) {
  const hidden = useCompact();
  const away = useSharedValue(0);
  useEffect(() => { away.value = withTiming(hidden ? 1 : 0, { duration: 180 }); }, [hidden, away]);
  const style = useAnimatedStyle(() => ({ height: interpolate(away.value, [0, 1], [HEIGHT, 0]), opacity: interpolate(away.value, [0, 0.6], [1, 0], 'clamp') }));
  if (count < 2) return null;
  return (
    <Animated.View style={[{ overflow: 'hidden' }, style]} accessibilityLabel={`${label} ${num(at)} من ${num(count)}`}>
      <View style={{ height: 2, backgroundColor: palette.rule }}>
        <View style={{ height: 2, width: `${(at / count) * 100}%`, alignSelf: 'flex-start', backgroundColor: palette.muted }} />
      </View>
      <Text style={{ alignSelf: 'flex-end', paddingHorizontal: 12, paddingTop: 2, color: palette.muted, fontSize: 11, lineHeight: 14 }}>{num(at)} / {num(count)}</Text>
    </Animated.View>
  );
}
