import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { usePalette } from '@/lib/theme';
import { useOnChange } from '@/lib/hooks/useOnChange';

function Dot({ delay, color }: { delay: number; color: string }) {
  const opacity = useSharedValue(0.25);
  useOnChange([delay, opacity], () => {
    opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.25, { duration: 400 })), -1));
  });
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ width: 9, height: 9, borderRadius: 5, backgroundColor: color }, style]} />;
}

export default function LoadingDots({ label = 'جارٍ التحميل', fill = false }: { label?: string; fill?: boolean }) {
  const palette = usePalette();
  const dots = (
    <View accessible={!fill} accessibilityLabel={fill ? undefined : label} style={{ flexDirection: 'row', gap: 6 }}>
      {[0, 160, 320].map(delay => <Dot key={delay} delay={delay} color={palette.accent} />)}
    </View>
  );
  return fill ? <View accessible accessibilityLabel={label} style={{ flexGrow: 1, minHeight: 80, alignItems: 'center', justifyContent: 'center' }}>{dots}</View> : dots;
}
