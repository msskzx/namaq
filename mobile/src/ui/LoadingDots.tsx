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

/** Three terracotta berries, the website's small loader. */
export default function LoadingDots() {
  const palette = usePalette();
  return (
    <View accessibilityLabel="جارٍ التحميل" style={{ flexDirection: 'row', gap: 6 }}>
      {[0, 160, 320].map(delay => <Dot key={delay} delay={delay} color={palette.accent} />)}
    </View>
  );
}
