import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { usePalette } from '@/lib/theme';

function Dot({ delay, color }: { delay: number; color: string }) {
  const opacity = useSharedValue(0.25);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.25, { duration: 400 })), -1));
  }, [delay, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ width: 9, height: 9, borderRadius: 5, backgroundColor: color }, style]} />;
}

/**
 * The one loader: three terracotta berries, the website's small loader. Inline where something small is coming (a button's
 * download, a player's answer); `fill` centres it in the room it is given, for a page or a sheet waiting for its content.
 * `label` says what is coming to a screen reader. The app's start screen (LoadingScreen) and the quiz timer (Hourglass) are not loaders.
 */
export default function LoadingDots({ label = 'جارٍ التحميل', fill = false }: { label?: string; fill?: boolean }) {
  const palette = usePalette();
  const dots = (
    <View accessible={!fill} accessibilityLabel={fill ? undefined : label} style={{ flexDirection: 'row', gap: 6 }}>
      {[0, 160, 320].map(delay => <Dot key={delay} delay={delay} color={palette.accent} />)}
    </View>
  );
  return fill ? <View accessible accessibilityLabel={label} style={{ flexGrow: 1, minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>{dots}</View> : dots;
}
